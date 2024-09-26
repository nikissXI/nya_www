import { produce } from "immer";
import { shallow } from "zustand/shallow";
import { createWithEqualityFn } from "zustand/traditional";

export interface BasicDisclosure {
  isOpen: boolean;
  onOpen: () => void;
  onClose: () => void;
  onToggle: () => void;
}

export interface IDisclosure {
  modifyGameListDisclosure: BasicDisclosure;
  modifyNavbarDisclosure: BasicDisclosure;
  modifyLoginDisclosure: BasicDisclosure;
  modifyGetWgnumDisclosure: BasicDisclosure;
}

export const useDisclosureStore = createWithEqualityFn<IDisclosure>((set) => {
  return {
    modifyGameListDisclosure: {
      isOpen: false,
      onOpen: () => {
        set((state) => {
          return produce(state, (draft) => {
            draft.modifyGameListDisclosure.isOpen = true;
          });
        });
      },
      onClose: () => {
        set((state) => {
          return produce(state, (draft) => {
            draft.modifyGameListDisclosure.isOpen = false;
          });
        });
      },
      onToggle: () => {
        set((state) => {
          return produce(state, (draft) => {
            draft.modifyGameListDisclosure.isOpen =
              !draft.modifyGameListDisclosure.isOpen;
          });
        });
      },
    },
    modifyNavbarDisclosure: {
      isOpen: false,
      onOpen: () => {
        set((state) => {
          return produce(state, (draft) => {
            draft.modifyNavbarDisclosure.isOpen = true;
          });
        });
      },
      onClose: () => {
        set((state) => {
          return produce(state, (draft) => {
            draft.modifyNavbarDisclosure.isOpen = false;
          });
        });
      },
      onToggle: () => {
        set((state) => {
          return produce(state, (draft) => {
            draft.modifyNavbarDisclosure.isOpen =
              !draft.modifyNavbarDisclosure.isOpen;
          });
        });
      },
    },
    modifyLoginDisclosure: {
      isOpen: false,
      onOpen: () => {
        set((state) => {
          return produce(state, (draft) => {
            draft.modifyLoginDisclosure.isOpen = true;
          });
        });
      },
      onClose: () => {
        set((state) => {
          return produce(state, (draft) => {
            draft.modifyLoginDisclosure.isOpen = false;
          });
        });
      },
      onToggle: () => {
        set((state) => {
          return produce(state, (draft) => {
            draft.modifyLoginDisclosure.isOpen =
              !draft.modifyLoginDisclosure.isOpen;
          });
        });
      },
    },
    modifyGetWgnumDisclosure: {
      isOpen: false,
      onOpen: () => {
        set((state) => {
          return produce(state, (draft) => {
            draft.modifyGetWgnumDisclosure.isOpen = true;
          });
        });
      },
      onClose: () => {
        set((state) => {
          return produce(state, (draft) => {
            draft.modifyGetWgnumDisclosure.isOpen = false;
          });
        });
      },
      onToggle: () => {
        set((state) => {
          return produce(state, (draft) => {
            draft.modifyGetWgnumDisclosure.isOpen =
              !draft.modifyGetWgnumDisclosure.isOpen;
          });
        });
      },
    },
  };
}, shallow);
