"use client";

// because asking for delete confirmation, this is an interactive ui state
// so it must be a client component

import { useEffect, useRef, useState } from "react";
// standard way to manage state, side effects, and direct DOM access in modern React

type DeleteGoalButtonProps = {
  action: () => void;
  // action is a function we can call with no arguments;
  // when it finishes, you don’t expect a return value.

  // Whoever uses this component must give me a no-argument
  // function that performs the delete (or whatever) when I call it;
  // I won’t expect any value back.
  goalName?: string | null;
};
// goalName: maybe provided, maybe not; if provided it can be a string or null.

// establishing the DeleteGoalButton function component,
// it takes in 2 props, action and goalName
export default function DeleteGoalButton({
  action,
  goalName,
}: DeleteGoalButtonProps) {
  // ({ action, goalName }: DeleteGoalButtonProps) = the component
  //  receives one props object, and immediately pulls out action and goalName from it using destructuring

  // A non-destructured version would look like this:
  // export default function DeleteGoalButton(props: DeleteGoalButtonProps) {
  //   const action = props.action;
  //   const goalName = props.goalName;
  // }

  const [open, setOpen] = useState(false);
  // creates a piece of react state
  // open = the current value
  // setOpen = the function that changes the value
  // false = the starting value
  // at first, open is false
  // to change the state, setOpen(true)

  const dialogRef = useRef<HTMLDialogElement | null>(null);
  //   “Keep a reference to the actual <dialog> element in the browser.”
  //   “Create a special React object whose .current will hold a pointer to the <dialog>
  // in the DOM, and keep that pointer stable across renders.”
  // This is so we can keep a reference to the actual dialog element so we can control it.

  //   useEffect runs after render and is used for side effects like directly controlling DOM elements
  //   “Whenever open changes, look at the real dialog element.
  // If the dialog exists, open it when open is true, and close it when open is false.”
  useEffect(() => {
    const dialog = dialogRef.current;
    // naming a constant called dialog that grabs the current state of the dialog element
    // now dialog == the actual dialog

    if (!dialog) return;
    // if there is no dialog, aka the reference is still null, we exit, this is a safety because if we keep going,
    // trying to read the null will break it

    if (open) {
      //if the open state is true
      dialog.showModal();
      //we set the dialog element to .showModal which makes the dialog element visible
    } else if (dialog.open) {
      //else if the state is false and the dialog is currently open
      dialog.close();
      // we close it
    }
  }, [open]);
  // this tells react when to run the useEffect code, this is the dependency array
  // this code runs after render, then reruns whenever the open state changes

  return (
    <>
      <button type="button" onClick={() => setOpen(true)}>
        delete
      </button>
      {/* the button is always rendered, when it's clicked, we set the open status using setOpen to true, when this happens, useEffect is run */}

      <dialog ref={dialogRef}>
        {/* the ref is how it knows it's this specific dialog element */}
        <p>Are you sure?</p>

        <button type="button" onClick={() => setOpen(false)}>
          Cancel
        </button>

        {/* the action that gets submitted on submit is fed into DeleteGoalButton */}
        <form action={action}>
          <button type="submit">Confirm delete</button>
        </form>
      </dialog>
    </>
  );
}
