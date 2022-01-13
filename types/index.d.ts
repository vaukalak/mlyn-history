export declare const createHistory: (subject$: any) => ((() => {
    destroy: () => void;
}) | {
    past$: import("mlyn").Subject<any[]>;
    commit: () => void;
    future$: import("mlyn").Subject<any[]>;
    entries$: () => any[];
    canUndo$: () => boolean;
    canRedo$: () => boolean;
    reset: () => void;
    redo: () => void;
    undo: () => void;
    jumpTo: (index: any) => void;
})[];
