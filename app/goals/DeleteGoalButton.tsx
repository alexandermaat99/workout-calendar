"use client";

// because asking for delete confirmation, this is an interactive ui state
// so it must be a client component

import { useEffect, useRef, useState } from "react";

type DeleteGoalButtonProps = {
  action: () => void;
  goalName?: string | null;
};

export default function DeleteGoalButton({
  action,
  goalName,
}: DeleteGoalButtonProps) {
  const [open, setOpen] = useState(false);
  const dialogRef = useRef<HTMLDialogElement | null>(null);

  useEffect(() => {
    const dialog = dialogRef.current;
    if (!dialog) return;

    if (open) {
      dialog.showModal();
    } else if (dialog.open) {
      dialog.close();
    }
  }, [open]);

  return (
    <>
      <button type="button" onClick={() => setOpen(true)}>
        delete
      </button>

      <dialog ref={dialogRef}>
        <p>Are you sure?</p>

        <button type="button" onClick={() => setOpen(false)}>
          Cancel
        </button>

        <form action={action}>
          <button type="submit">Confirm delete</button>
        </form>
      </dialog>
    </>
  );
}
