import React, { useState, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { User, ChevronDown, ChevronRight, Package, LayoutGrid, PlusCircle } from 'lucide-react';

interface Node {
    id: string;
    name: string;
    rank: string;
    left?: Node | null;
    right?: Node | null;
}

interface TankUser {
    id: string;
    name: string;
    date: string;
    rank: string;
}

// Rank Badge Component
const RankBadge = ({ rank }: { rank: string }) => {
    const rankConfig: Record<string, { bg: string, text: string }> = {
        'Associate': { bg: 'rgba(255, 255, 255, 0.1)', text: '#A0A0A0' },
        'Senior Associate': { bg: 'rgba(41, 151, 255, 0.15)', text: '#2997ff' },
        'Manager': { bg: 'rgba(48, 209, 88, 0.15)', text: '#30d158' },
        'Senior Manager': { bg: 'rgba(255, 214, 10, 0.15)', text: '#ffd60a' },
        'Director': { bg: 'rgba(255, 55, 95, 0.15)', text: '#ff375f' },
        'Senior Director': { bg: 'rgba(191, 90, 242, 0.15)', text: '#bf5af2' },
        'Executive Director': { bg: 'rgba(255, 255, 255, 0.15)', text: '#ffffff' }
    };

    const config = rankConfig[rank] || rankConfig['Associate'];

    return (
        <span
            className="rank-badge"
            style={{
                backgroundColor: config.bg,
                color: config.text,
                fontSize: '0.65rem',
                padding: '2px 8px',
                borderRadius: '6px',
                fontWeight: 600,
                textTransform: 'uppercase',
                border: 'none',
                display: 'inline-flex',
                alignItems: 'center',
                justifyContent: 'center',
                minWidth: '70px',
                letterSpacing: '0.04em'
            }}
        >
            {rank}
        </span>
    );
};

// Empty Node Slot with Drag Interaction
const EmptyNodeSlot = ({ position, onDrop }: { position: 'left' | 'right', onDrop: (e: React.DragEvent, position: 'left' | 'right') => void }) => {
    const [isDragOver, setIsDragOver] = useState(false);

    const handleDragOver = (e: React.DragEvent) => {
        e.preventDefault();
        e.dataTransfer.dropEffect = "move";
    };

    const handleDragEnter = (e: React.DragEvent) => {
        e.preventDefault();
        setIsDragOver(true);
    };

    const handleDragLeave = (e: React.DragEvent) => {
        e.preventDefault();
        setIsDragOver(false);
    };

    const handleDropInternal = (e: React.DragEvent) => {
        e.preventDefault();
        setIsDragOver(false);
        onDrop(e, position);
    };

    return (
        <div
            className={`empty-node-slot ${isDragOver ? 'highlight-drop-zone' : ''}`}
            onDragOver={handleDragOver}
            onDragEnter={handleDragEnter}
            onDragLeave={handleDragLeave}
            onDrop={handleDropInternal}
        >
            <div className="dashed-circle">
                <PlusCircle size={20} />
            </div>
            <span className="slot-label">{position} Leg</span>
        </div>
    );
};

// Tree Node Component - Visual Upgrade
const TreeNode = ({
    node,
    onDrop
}: {
    node: Node,
    onDrop: (targetNodeId: string, position: 'left' | 'right', droppedUserId: string) => void
}) => {
    const [isOpen, setIsOpen] = useState(true);

    const handleDropWrapper = (e: React.DragEvent, position: 'left' | 'right') => {
        const userId = e.dataTransfer.getData("userId");
        if (userId) {
            onDrop(node.id, position, userId);
        }
    };

    return (
        <div className="tree-branch-container">
            {/* The Actual Node Card */}
            <div className="node-wrapper">
                <div className="tree-node-card glass-panel" onClick={() => setIsOpen(!isOpen)}>
                    <div className="node-avatar-large">
                        <User size={24} className="text-white" />
                    </div>
                    <div className="node-content">
                        <span className="node-name-lg">{node.name}</span>
                        <RankBadge rank={node.rank} />
                    </div>
                    {/* Expand/Collapse Toggle */}
                    {(node.left || node.right) && (
                        <div className="node-toggle">
                            {isOpen ? <ChevronDown size={12} /> : <ChevronRight size={12} />}
                        </div>
                    )}
                </div>
            </div>

            {/* Children Branches */}
            <AnimatePresence>
                {isOpen && (
                    <motion.div
                        className="children-container"
                        initial={{ opacity: 0, scale: 0.95 }}
                        animate={{ opacity: 1, scale: 1 }}
                        exit={{ opacity: 0, scale: 0.95 }}
                    >
                        {/* Connector Lines */}
                        <div className="connector-vertical"></div>

                        <div className="branch-split">
                            <div className="branch-leg left-leg">
                                <div className="connector-horizontal-left"></div>
                                <div className="leg-content">
                                    {node.left ? (
                                        <TreeNode node={node.left} onDrop={onDrop} />
                                    ) : (
                                        <EmptyNodeSlot position="left" onDrop={handleDropWrapper} />
                                    )}
                                </div>
                            </div>

                            <div className="branch-leg right-leg">
                                <div className="connector-horizontal-right"></div>
                                <div className="leg-content">
                                    {node.right ? (
                                        <TreeNode node={node.right} onDrop={onDrop} />
                                    ) : (
                                        <EmptyNodeSlot position="right" onDrop={handleDropWrapper} />
                                    )}
                                </div>
                            </div>
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>
        </div>
    );
};

// Holding Tank Component - Visual Upgrade
const HoldingTank = ({ users, onDragStart }: { users: TankUser[], onDragStart: (e: React.DragEvent, id: string) => void }) => {
    return (
        <div className="holding-tank glass-panel">
            <div className="tank-header">
                <div className="header-title">
                    <Package size={18} className="text-accent" />
                    <span>Holding Tank</span>
                </div>
                <span className="count-badge">{users.length}</span>
            </div>

            <div className="tank-scroll-area custom-scrollbar">
                <div className="tank-list">
                    <AnimatePresence mode='popLayout'>
                        {users.length === 0 ? (
                            <motion.div
                                initial={{ opacity: 0 }}
                                animate={{ opacity: 1 }}
                                className="empty-state text-secondary text-sm p-4 text-center"
                            >
                                No new associates
                            </motion.div>
                        ) : (
                            users.map(user => (
                                <motion.div
                                    layout
                                    initial={{ opacity: 0, x: -20 }}
                                    animate={{ opacity: 1, x: 0 }}
                                    exit={{ opacity: 0, scale: 0.9 }}
                                    whileHover={{ scale: 1.02, backgroundColor: 'rgba(255,255,255,0.08)' }}
                                    whileTap={{ scale: 0.98 }}
                                    key={user.id}
                                    className="tank-item glass-card grab-cursor"
                                    draggable
                                    onDragStart={(e) => {
                                        // Set ghost image or style?
                                        // Standard HTML5 behavior for now, but style on drag
                                        onDragStart(e as unknown as React.DragEvent, user.id)
                                    }}
                                >
                                    <div className="drag-indicator">
                                        <LayoutGrid size={14} className="drag-handle" />
                                    </div>
                                    <div className="user-meta">
                                        <span className="name">{user.name}</span>
                                        <span className="meta-row">
                                            <RankBadge rank={user.rank} />
                                            <span className="time">{user.date}</span>
                                        </span>
                                    </div>
                                </motion.div>
                            ))
                        )}
                    </AnimatePresence>
                </div>
            </div>

            <div className="tank-footer">
                <p>Drag to empty positions <span>+</span></p>
            </div>
        </div>
    );
};

// Main Unified Section
export const GenealogySection: React.FC = () => {
    // Initial State
    const [treeData, setTreeData] = useState<Node>({
        id: '1',
        name: 'Slade Johnson',
        rank: 'Executive Director',
        left: {
            id: '2',
            name: 'Alex Rivera',
            rank: 'Director',
            left: { id: '4', name: 'James Wilson', rank: 'Manager' },
            right: null
        },
        right: {
            id: '3',
            name: 'Elena Vance',
            rank: 'Senior Director',
            left: null,
            right: null
        }
    });

    const [tankUsers, setTankUsers] = useState<TankUser[]>([
        { id: '101', name: 'David Smith', date: '2h ago', rank: 'Associate' },
        { id: '102', name: 'Luna Love', date: '5h ago', rank: 'Senior Associate' },
        { id: '103', name: 'Crypto King', date: '1d ago', rank: 'Manager' },
        { id: '104', name: 'Sarah Jones', date: '2d ago', rank: 'Associate' },
        { id: '105', name: 'Mike Ross', date: '3d ago', rank: 'Manager' }
    ]);

    const handleDragStart = (e: React.DragEvent, id: string) => {
        e.dataTransfer.setData("userId", id);
        e.dataTransfer.effectAllowed = "move";
    };

    // Recursive insertion function
    const insertNode = (currentNode: Node, targetId: string, position: 'left' | 'right', newUser: TankUser): Node => {
        if (currentNode.id === targetId) {
            return {
                ...currentNode,
                [position]: {
                    id: newUser.id,
                    name: newUser.name,
                    rank: newUser.rank,
                    left: null,
                    right: null
                }
            };
        }
        return {
            ...currentNode,
            left: currentNode.left ? insertNode(currentNode.left, targetId, position, newUser) : null,
            right: currentNode.right ? insertNode(currentNode.right, targetId, position, newUser) : null
        };
    };

    const handleDrop = (targetNodeId: string, position: 'left' | 'right', droppedUserId: string) => {
        const userToMove = tankUsers.find(u => u.id === droppedUserId);
        if (!userToMove) return;

        // Update Tree
        setTreeData(prev => insertNode(prev, targetNodeId, position, userToMove));

        // Remove from Tank
        setTankUsers(prev => prev.filter(u => u.id !== droppedUserId));
    };

    return (
        <div className="genealogy-section-container">
            <div className="section-header mb-6">
                <h3>Binary Genealogy Management</h3>
                <p className="text-secondary text-sm">Drag associates from the Holding Tank to empty leg positions.</p>
            </div>

            <div className="genealogy-layout-grid">
                <div className="tree-area">
                    {/* Added custom-scrollbar class for horizontal scrolling */}
                    <div className="tree-scroll-container custom-scrollbar">
                        <div className="tree-canvas">
                            <TreeNode node={treeData} onDrop={handleDrop} />
                        </div>
                    </div>
                </div>

                <div className="tank-sidebar">
                    <HoldingTank users={tankUsers} onDragStart={handleDragStart} />
                </div>
            </div>
        </div>
    );
};

