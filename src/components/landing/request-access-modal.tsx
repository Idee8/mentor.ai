"use client";

import {
  Dispatch,
  SetStateAction,
  useCallback,
  useMemo,
  useState,
} from "react";

import { Modal } from "../ui/modal";
import { Hexagon } from "lucide-react";
import { Input } from "../ui/input";
import { Button } from "../ui/button";

const RequestAccessModal = ({
  setShowRequestAccessModal,
  showRequestAccessModal,
}: {
  showRequestAccessModal: boolean;
  setShowRequestAccessModal: Dispatch<SetStateAction<boolean>>;
}) => {
  return (
    <Modal
      showModal={showRequestAccessModal}
      setShowModal={setShowRequestAccessModal}
    >
      <div className="flex flex-col items-center justify-center space-y-4 border-b px-4 py-6 pt-8 text-center md:px-8">
        <Hexagon className="h-10 w-10 text-primary" />
        <h2 className="sm:text-xl text-lg font-medium">Get Early Access</h2>
        <p className="text-sm">
          Gain understanding whenever you are stuck or expand your knowledge
          into full paragraphs. Join our early access program.
        </p>
        <div className="w-full space-y-4">
          <Input
            type="email"
            placeholder="Enter your email"
            className="w-full"
          />
          <Button>Join now!</Button>
        </div>
      </div>
    </Modal>
  );
};

export function useRequestAccessModal() {
  const [showRequestAccessModal, setShowRequestAccessModal] = useState(false);

  const RequestAccessModalCallback = useCallback(() => {
    return (
      <RequestAccessModal
        setShowRequestAccessModal={setShowRequestAccessModal}
        showRequestAccessModal={showRequestAccessModal}
      />
    );
  }, [showRequestAccessModal, setShowRequestAccessModal]);

  return useMemo(
    () => ({
      setShowRequestAccessModal,
      RequestAccessModal: RequestAccessModalCallback,
    }),
    [setShowRequestAccessModal, RequestAccessModalCallback]
  );
}
