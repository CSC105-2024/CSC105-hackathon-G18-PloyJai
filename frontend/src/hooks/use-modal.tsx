import React, { useCallback, useRef } from "react";
import { useModalStore } from "@/store/modal";

type ContentGenerator<T> = string | ((props: T) => React.ReactNode);

export const createModalHook = <T extends object>(
  ModalContent: React.ComponentType<T>,
  slugId: ContentGenerator<T>,
  title: ContentGenerator<T>,
  description?: ContentGenerator<T>,
) => {
  return () => {
    const { openModal, closeModal } = useModalStore();
    const slugIdRef = useRef<string | null>(null);

    const open = useCallback((props: T) => {
      const modalSlugId = typeof slugId === "function" ? slugId(props) : slugId;
      slugIdRef.current = modalSlugId as string;

      const modalTitle = typeof title === "function" ? title(props) : title;
      const modalDescription =
        typeof description === "function" ? description(props) : description;
      openModal(
        modalSlugId as string,
        <ModalContent {...props} />,
        modalTitle as React.ReactNode,
        modalDescription as React.ReactNode,
      );
    }, []);

    const close = useCallback(() => {
      if (slugIdRef.current) closeModal(slugIdRef.current);
    }, []);

    return { open, close };
  };
};
