import os
import time
import json
import socket
import logging
from os.path import join, exists
from traceback import print_exc
from threading import Thread, Lock
from datetime import datetime, timezone
from typing import Callable, Dict, Optional
from backend.utils import Logger


# * 8192 * 8192# 8192  # Adjust the buffer size as needed (4096)
SOCKET_BUFFER_SIZE = 1024 * 4


class MTSocketClient:
    def __init__(
        self,
        event_handler=None,
        host="127.0.0.1",
        port=5000,
        metatrader_dir_path="",
        sleep_delay=0.005,
        max_retry_command_seconds=15,
        max_retries=5,
        load_orders_from_file=True,
        verbose=True,
        logger: logging.Logger = None,
    ):

        self.logger = logger if logger is not None else Logger(name=__class__.__name__)

        if not exists(metatrader_dir_path):
            self.logger.error("ERROR: metatrader_dir_path does not exist!")
            # exit() # Don't exit the whole process in FastAPI context, just log error
            
        self.event_handler = event_handler
        self.sleep_delay = sleep_delay
        self.max_retry_command_seconds = max_retry_command_seconds
        self.max_retries = max_retries
        self.load_orders_from_file = load_orders_from_file

        # events verbose
        self.verbose = verbose
        self.verbose_on_order_event = False

        self.command_id = 0

        self.host = host
        self.port = port
        self.connected = False

        self.path_orders = join(metatrader_dir_path, "DWX", "DWX_Orders.txt")
        self.path_messages = join(metatrader_dir_path, "DWX", "DWX_Messages.txt")
        self.path_market_data = join(metatrader_dir_path, "DWX", "DWX_Market_Data.txt")
        self.path_bar_data = join(metatrader_dir_path, "DWX", "DWX_Bar_Data.txt")
        self.path_historic_data = join(
            metatrader_dir_path, "DWX", "DWX_Historic_Data.txt"
        )
        self.path_historic_trades = join(
            metatrader_dir_path, "DWX", "DWX_Historic_Trades.txt"
        )
        self.path_symbols_data = join(
            metatrader_dir_path, "DWX", "DWX_Symbols_Data.txt"
        )
        self.path_orders_stored = join(
            metatrader_dir_path, "DWX", "DWX_Orders_Stored.txt"
        )
        self.path_messages_stored = join(
            metatrader_dir_path, "DWX", "DWX_Messages_Stored.txt"
        )

        self._last_messages_millis = 0
        self._last_open_orders_str = ""
        self._last_messages_str = ""
        self._last_market_data_str = ""
        self._last_bar_data_str = ""
        self._last_historic_data_str = ""
        self._last_historic_trades_str = ""
        self._last_symbols_data_str = ""

        self.open_orders = {}
        self.closed_orders = []
        self.account_info = {}
        self.market_data = {}
        self.bar_data = {}
        self.historic_data = {}
        self.historic_trades = {}
        self.symbols_data = {}

        self._last_bar_data = {}
        self._last_market_data = {}

        self.ACTIVE = True
        self.START = False

        self.connection: Optional[socket.socket] = None

        self.lock = Lock()

        self.load_messages()

        if self.load_orders_from_file:
            self.load_orders()

        if self.event_handler is None:
            self.start()

    @property
    def is_connected(self) -> bool:
        """Returns connection status.
        Returns:
            bool: True or False
        """
        return self.connected

    def start(self):
        self.connect()
        self.initialize_tasks()
        self.reset_command_ids()
        self.START = True

    def stop(self):
        self.ACTIVE = False
        self.START = False

    def connect(self):
        retries = 0
        while retries < self.max_retries:
            try:
                # Create a socket object
                self.connection = socket.socket(socket.AF_INET, socket.SOCK_STREAM)

                # Set timeout
                self._set_timeout()

                self.connection.connect(
                    (self.host, self.port)
                )  # limit=1024 * 2,  # Buffer size limit (2 KiB)
                self.connected = True
                self.logger.info(f"Connected to server at {self.host}:{self.port}")
                return True
            except socket.error as e:
                self.logger.error(f"Failed to connect to socket server: {e}")
                retries += 1
                time.sleep(self.max_retry_command_seconds)
                # self.connection.close() # Might trigger error if not open
            except KeyboardInterrupt:
                if self.connection:
                    self.connection.close()
                return False

        self.logger.error(f"Failed to connect after {self.max_retries} attempts")

    def _set_timeout(self, timeout_in_seconds: int = 120) -> None:
        """
        Set time out value for socket communication with MT4 or MT5 EA/Bot.

        Args:
            timeout_in_seconds: the time out value
        Returns:
            None
        """
        self.timeout_value = timeout_in_seconds
        self.connection.settimeout(
            self.timeout_value
        )  # improve the timeout value (causes socket to end without completing task)
        self.connection.setblocking(1)
        return

    def disconnect(self) -> bool:
        """
        Closes the socket connection to a MT4 or MT5 EA bot.

        Args:
            None
        Returns:
            bool: True or False
        """
        if self.connection:
            self.connection.close()
        return True

    def initialize_tasks(self):
        self.messages_thread = Thread(target=self.check_messages, args=())
        self.messages_thread.daemon = True
        self.messages_thread.start()

        self.market_data_thread = Thread(target=self.check_market_data, args=())
        self.market_data_thread.daemon = True
        self.market_data_thread.start()

        self.bar_data_thread = Thread(target=self.check_bar_data, args=())
        self.bar_data_thread.daemon = True
        self.bar_data_thread.start()

        self.open_orders_thread = Thread(target=self.check_open_orders, args=())
        self.open_orders_thread.daemon = True
        self.open_orders_thread.start()

        self.historic_data_thread = Thread(target=self.check_historic_data, args=())
        self.historic_data_thread.daemon = True
        self.historic_data_thread.start()

        self.historic_trades_thread = Thread(target=self.check_historic_trades, args=())
        self.historic_trades_thread.daemon = True
        self.historic_trades_thread.start()

        self.symbols_data_thread = Thread(target=self.check_symbols_data, args=())
        self.symbols_data_thread.daemon = True
        self.symbols_data_thread.start()

    def try_read_file(self, file_path):
        try:
            if exists(file_path):
                with open(file_path, mode="r", encoding='utf-8', errors='replace') as f:
                    return f.read()
        except (IOError, PermissionError):
            pass
        except Exception:
            print_exc()
        return ""

    def try_remove_file(self, file_path):
        try:
            os.remove(file_path)
        except (IOError, PermissionError):
            pass
        except Exception:
            print_exc()

    def clean_files(self):
        paths = [
            self.path_orders,
            self.path_messages,
            self.path_market_data,
            self.path_bar_data,
            self.path_historic_data,
            self.path_historic_trades,
            self.path_symbols_data,
            self.path_orders_stored,
            self.path_messages_stored,
        ]

        for path in paths:
            if exists(path):
                self.try_remove_file(path)

        return

    def check_open_orders(self):
        while self.ACTIVE:
            time.sleep(self.sleep_delay)
            if not self.START:
                continue

            text = self.try_read_file(self.path_orders)
            if not text.strip() or text == self._last_open_orders_str:
                continue

            try:
                data = dict(json.loads(text))
            except json.JSONDecodeError as e:
                self.logger.error(f"Failed to decode JSON from {self.path_orders}: {e}")
                continue

            self._last_open_orders_str = text
            new_event = False

            current_order_ids = set(data["orders"].keys())
            with self.lock:
                previous_order_ids = set(self.open_orders.keys())

                removed_order_ids = previous_order_ids - current_order_ids
                self.logger.debug(f"removed_order_ids: {removed_order_ids}")
                for order_id in removed_order_ids:
                    order = self.open_orders.pop(order_id, None)
                    if order:
                        order["order_id"] = order_id
                        order["event_type"] = "Order:Removed"
                        self.closed_orders.append(order)
                        new_event = True
                        if self.verbose_on_order_event:
                            self.logger.debug(f"Order removed: {order}")

                added_order_ids = current_order_ids - previous_order_ids
                for order_id in added_order_ids:
                    order = data["orders"][order_id]
                    order["order_id"] = order_id
                    order["event_type"] = "Order:Created"
                    order["open_time_dt"] = datetime.strptime(
                        order["open_time"], "%Y.%m.%d %H:%M:%S"
                    )
                    self.open_orders[order_id] = order
                    # del self.open_orders[order_id]["order_id"]
                    new_event = True
                    if self.verbose_on_order_event:
                        self.logger.debug(f"New order: {order}")

                if len(self.open_orders) > 0:
                    # Ensure all orders have open_time_dt
                    for order in self.open_orders.values():
                        if "open_time_dt" not in order:
                            order["open_time_dt"] = datetime.strptime(
                                order["open_time"], "%Y.%m.%d %H:%M:%S"
                            )

                    self.open_orders = dict(
                        sorted(
                            self.open_orders.items(),
                            key=lambda item: item[1]["open_time_dt"],
                        )
                    )

                    for order in self.open_orders.values():
                        del order["open_time_dt"]

                if self.event_handler is not None and new_event:
                    self.event_handler.on_order_event(
                        self.open_orders, self.closed_orders
                    )

                if self.load_orders_from_file:
                    try:
                        with open(self.path_orders_stored, mode="w") as f:
                            f.write(json.dumps(data))
                    except Exception as e:
                        self.logger.error(
                            f"Failed to write to {self.path_orders_stored}: {e}"
                        )

                if new_event and self.verbose_on_order_event:
                    self.logger.debug("New orders event processed")

    def check_messages(self):
        while self.ACTIVE:
            time.sleep(self.sleep_delay)
            if not self.START:
                continue

            text = self.try_read_file(self.path_messages)
            if not text.strip() or text == self._last_messages_str:
                continue

            try:
                data = json.loads(text)
            except json.JSONDecodeError as e:
                self.logger.error(
                    f"Failed to decode JSON from {self.path_messages}: {e}"
                )
                continue

            new_event = False

            with self.lock:
                for millis, message in sorted(data.items()):
                    if int(millis) > self._last_messages_millis:
                        self._last_messages_millis = int(millis)
                        if self.event_handler is not None:
                            self.event_handler.on_message(message)
                        new_event = True

                try:
                    with open(self.path_messages_stored, mode="w") as f:
                        f.write(json.dumps(data))
                except Exception as e:
                    self.logger.error(
                        f"Failed to write to {self.path_messages_stored}: {e}"
                    )

                self._last_messages_str = text

            if new_event:
                self.logger.debug("New message events processed")

    def check_market_data(self):
        while self.ACTIVE:
            time.sleep(self.sleep_delay)
            if not self.START:
                continue

            text = self.try_read_file(self.path_market_data)
            if not text.strip() or text == self._last_market_data_str:
                continue

            try:
                market_data = json.loads(text)
            except json.JSONDecodeError as e:
                self.logger.error(
                    f"Failed to decode JSON from {self.path_market_data}: {e}"
                )
                continue

            new_event = False

            with self.lock:
                self.market_data = market_data

                if self.event_handler is not None:
                    for symbol, data in self.market_data.items():
                        if (
                            symbol not in self._last_market_data
                            or self.market_data[symbol]
                            != self._last_market_data[symbol]
                        ):
                            self.event_handler.on_tick(
                                symbol,
                                self.market_data[symbol]["bid"],
                                self.market_data[symbol]["ask"],
                            )
                            new_event = True

                self._last_market_data = self.market_data
                self._last_market_data_str = text

            if new_event:
                self.logger.debug("New market data events processed")

    def check_bar_data(self):
        while self.ACTIVE:
            time.sleep(self.sleep_delay)
            if not self.START:
                continue

            text = self.try_read_file(self.path_bar_data)
            if not text.strip() or text == self._last_bar_data_str:
                continue

            try:
                bar_data = json.loads(text)
            except json.JSONDecodeError as e:
                self.logger.error(
                    f"Failed to decode JSON from {self.path_bar_data}: {e}"
                )
                continue

            new_event = False

            with self.lock:
                self.bar_data = bar_data

                if self.event_handler is not None:
                    for st, data in self.bar_data.items():
                        if (
                            st not in self._last_bar_data
                            or self.bar_data[st] != self._last_bar_data[st]
                        ):
                            symbol, time_frame = st.split("_")
                            self.event_handler.on_bar_data(
                                symbol,
                                time_frame,
                                self.bar_data[st]["time"],
                                self.bar_data[st]["open"],
                                self.bar_data[st]["high"],
                                self.bar_data[st]["low"],
                                self.bar_data[st]["close"],
                                self.bar_data[st]["tick_volume"],
                            )
                            new_event = True

                self._last_bar_data = self.bar_data
                self._last_bar_data_str = text

            if new_event:
                self.logger.debug("New bar data events processed")

    def check_historic_data(self):
        while self.ACTIVE:
            time.sleep(self.sleep_delay)
            if not self.START:
                continue

            text = self.try_read_file(self.path_historic_data)
            if text.strip() and text != self._last_historic_data_str:
                try:
                    data = json.loads(text)
                except json.JSONDecodeError as e:
                    self.logger.error(
                        f"Failed to decode JSON from {self.path_historic_data}: {e}"
                    )
                    continue

                with self.lock:
                    for st, historic_data in data.items():
                        self.historic_data[st] = historic_data
                        if self.event_handler is not None:
                            try:
                                symbol, time_frame = st.split("_")
                                self.event_handler.on_historic_data(
                                    symbol, time_frame, historic_data
                                )
                            except ValueError as e:
                                self.logger.error(
                                    f"Failed to split symbol and time_frame from {st}: {e}"
                                )

                    self._last_historic_data_str = text

                self.try_remove_file(self.path_historic_data)
                self.logger.debug("Processed and removed historic data file")

    def check_historic_trades(self):
        while self.ACTIVE:
            time.sleep(self.sleep_delay)
            if not self.START:
                continue

            text = self.try_read_file(self.path_historic_trades)
            if text.strip() and text != self._last_historic_trades_str:
                try:
                    historic_trades = json.loads(text)
                except json.JSONDecodeError as e:
                    self.logger.error(
                        f"Failed to decode JSON from {self.path_historic_trades}: {e}"
                    )
                    continue

                with self.lock:
                    self.historic_trades = historic_trades

                    if self.event_handler is not None:
                        try:
                            self.event_handler.on_historic_trades(self.historic_trades)
                        except Exception as e:
                            self.logger.error(
                                f"Error in event handler for historic trades: {e}"
                            )

                    self._last_historic_trades_str = text

                self.try_remove_file(self.path_historic_trades)
                self.logger.debug("Processed and removed historic trades file")

    def check_symbols_data(self):
        while self.ACTIVE:
            time.sleep(self.sleep_delay)
            if not self.START:
                continue

            text = self.try_read_file(self.path_symbols_data)
            if text.strip() and text != self._last_symbols_data_str:
                try:
                    symbols_data = json.loads(text)
                except json.JSONDecodeError as e:
                    self.logger.error(
                        f"Failed to decode JSON from {self.path_symbols_data}: {e}"
                    )
                    continue

                with self.lock:
                    self.symbols_data = symbols_data

                    if self.event_handler is not None:
                        try:
                            self.event_handler.on_symbols_data(self.symbols_data)
                        except Exception as e:
                            self.logger.error(
                                f"Error in event handler for symbols data: {e}"
                            )

                    # Temporary fix: get fresh symbols data always
                    self._last_symbols_data_str = ""

                self.try_remove_file(self.path_symbols_data)
                self.logger.debug("Processed and removed symbols data file")

    def load_orders(self):
        text = self.try_read_file(self.path_orders_stored)
        if text.strip():
            try:
                data = json.loads(text)
                self.open_orders = data.get("orders", {})
                self._last_open_orders_str = text
                self.logger.debug(f"Loaded orders: {self.open_orders}")
            except json.JSONDecodeError as e:
                self.logger.error(
                    f"Failed to decode JSON from {self.path_orders_stored}: {e}"
                )
            except Exception as e:
                self.logger.error(f"Unexpected error loading orders: {e}")

    def load_messages(self):
        text = self.try_read_file(self.path_messages_stored)
        if text.strip():
            try:
                data = json.loads(text)
                latest_millis = self._last_messages_millis

                for millis in data.keys():
                    try:
                        millis_int = int(millis)
                        if millis_int > latest_millis:
                            latest_millis = millis_int
                    except ValueError as e:
                        self.logger.error(
                            f"Invalid millis value in {self.path_messages_stored}: {e}"
                        )

                self._last_messages_millis = latest_millis
                self._last_messages_str = text
                self.logger.debug(
                    f"Loaded messages up to millis: {self._last_messages_millis}"
                )
            except json.JSONDecodeError as e:
                self.logger.error(
                    f"Failed to decode JSON from {self.path_messages_stored}: {e}"
                )
            except Exception as e:
                self.logger.error(f"Unexpected error loading messages: {e}")

    def generate_command_id(self):
        self.command_id = round(datetime.now(timezone.utc).timestamp())
        return self.command_id

    def _send_request(self, data: str) -> None:
        """Send request to the server via socket"""
        try:
            if self.connection:
                self.connection.sendall(data.encode())  # Encode and send as bytes
            else:
                self.logger.error("Cannot send request, connection is None")
        except AssertionError as err:
            raise err from Exception  # Handle exceptions as needed
        except Exception as e:
             self.logger.error(f"Error sending request: {e}")

    def _receive_response(self):
        """
        Receives a response from the server and decodes the JSON data.

        Raises:
            Exception: If no data is received from the server, JSON decoding fails,
                      or there's a socket error after retries.
        """
        retry_delay = 0.5  # Adjust this delay as needed
        max_retries = 5
        retries = 0

        while retries < max_retries:
            buffer = b""
            try:
                while True:
                    if not self.connection:
                         raise Exception("No connection")
                         
                    data = self.connection.recv(SOCKET_BUFFER_SIZE)
                    if not data:
                        raise Exception("No data received from the server")

                    buffer += data

                    try:
                        msg, idx = json.JSONDecoder().raw_decode(
                            buffer.decode().strip()
                        )
                        buffer = buffer[idx:]
                        return msg
                    except json.JSONDecodeError:
                        pass

            except Exception as e:  # Catch all exceptions here
                self.logger.error(f"Socket receive error: {e}")
                if (
                    retries < max_retries - 1
                ):  # Retry on all exceptions except the last attempt
                    self.logger.error(
                        f"Retrying in {retry_delay} seconds... (attempt {retries+1}/{max_retries})"
                    )
                    time.sleep(retry_delay)
                    retries += 1
                else:
                    raise  # Re-raise the exception on the last attempt

        raise Exception("Failed to receive data after multiple retries")

    def send_command(self, command: str, content: str) -> Optional[Dict]:
        if self.verbose:
            self.logger.info(f"Sending Command {command} to MT socket server")

        command_id = self.generate_command_id()
        self._send_request(f"<:{command_id}|{command}|{content}:>")

        response = self._receive_response()
        return response

    def wait_for_event(
        self,
        event_checker: Callable[[], bool],
        sleep_delay: float = 0.005,
        timeout: int = 30,
    ) -> bool:
        start_time = datetime.now()
        while (datetime.now() - start_time).seconds < timeout:
            if event_checker():
                return True
            time.sleep(sleep_delay)
        return False

    def reset_command_ids(self):
        """Resets the command IDs."""
        self.command_id = 0
        self._last_open_orders_str = ""
        self._last_messages_str = ""
        self._last_market_data_str = ""
        self._last_bar_data_str = ""
        self._last_historic_data_str = ""
        self._last_historic_trades_str = ""
        self._last_symbols_data_str = ""
        self._last_messages_millis = 0

        self.send_command("RESET_COMMAND_IDS", "")
        return

    def get_account_info(self) -> Optional[Dict]:
        """
        Get Account Info
        """
        data = self.send_command("ACCOUNT_INFO", "")
        if data is None:
            return None

        self.account_info = data["account_info"]
        return self.account_info

    def get_active_symbols(self, symbol="") -> Optional[Dict]:
        """
        Sends a GET_ACTIVE_SYMBOLS command to request either all the active symbols information or the specified symbol's information from the trade server.

        Active symbols are defined are those symbols whose spread > 0.
        """
        self.symbols_data = self.send_command("GET_ACTIVE_SYMBOLS", str(symbol))
        if self.symbols_data is None:
            return None

        if self.event_handler is not None:
            self.event_handler.on_symbols_data(self.symbols_data)

        return self.symbols_data

    def subscribe_symbols(self, symbols):
        """Sends a SUBSCRIBE_SYMBOLS command to subscribe to market (tick) data."""
        self.send_command("SUBSCRIBE_SYMBOLS", ",".join(symbols))
        return

    def subscribe_symbols_bar_data(self, symbols=[["EURUSD", "M1"]]):
        """Sends a SUBSCRIBE_SYMBOLS_BAR_DATA command to subscribe to bar data."""
        request_data = [f"{st[0]},{st[1]}" for st in symbols]
        self.send_command(
            "SUBSCRIBE_SYMBOLS_BAR_DATA", ",".join(str(p) for p in request_data)
        )
        return

    def get_historic_data(
        self,
        symbol="EURUSD",
        time_frame="D1",
        start=0,
        end=0,
    ):
        """Sends a GET_HISTORIC_DATA command to request historic data."""
        # 1. Send request
        self.send_command(
            "GET_HISTORIC_DATA", f"{symbol},{time_frame},{start},{end}"
        )
