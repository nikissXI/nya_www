import { produce } from "immer";
import { shallow } from "zustand/shallow";
import { createWithEqualityFn } from "zustand/traditional";

export interface BasicDisclosure {
  isOpen: boolean;
  onToggle: () => void;
}

export interface IDisclosure {
  modifyGameListDisclosure: BasicDisclosure;
  modifyLoginDisclosure: BasicDisclosure;
}

export const useDisclosureStore = createWithEqualityFn<IDisclosure>((set) => {
  return {
    modifyGameListDisclosure: {
      isOpen: false,
      onToggle: () => {
        set((state) => {
          return produce(state, (draft) => {
            draft.modifyGameListDisclosure.isOpen =
              !draft.modifyGameListDisclosure.isOpen;
          });
        });
      },
    },

    modifyLoginDisclosure: {
      isOpen: false,
      onToggle: () => {
        set((state) => {
          return produce(state, (draft) => {
            draft.modifyLoginDisclosure.isOpen =
              !draft.modifyLoginDisclosure.isOpen;
          });
        });
      },
    },
  };
}, shallow);
