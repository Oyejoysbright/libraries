import React from "react";
import { storiesOf} from "@storybook/react";
import { ButtonType, DialogType, DialogButton, Modal, TestDialog, TestModal, IButton } from "./Dialog";
import { Provider } from "react-redux";
import { createStore } from "redux";
import { DialogReducer } from "./dialog.reducer";

storiesOf("Dialog", module)
.addDecorator((story) => (
    <Provider store={createStore(DialogReducer)}>
        {story()}
    </Provider>
))
.add("Modal", () => (<TestModal show>My Modal</TestModal>))
.add("alert - OK", () => (<TestDialog type={DialogType.alert} show={true} buttons={ () => DialogButton(ButtonType.OK, [console.log], ["ok-btn"])} />))
.add("alert - CLOSE", () => (<TestDialog type={DialogType.alert} show={true} buttons={ () => DialogButton(ButtonType.Close, [console.log], ["ok-btn"])} />))
.add("confirm - OK_CANCEL", () => (<TestDialog type={DialogType.confirm} show buttons={() => DialogButton(ButtonType.OkCancel, [() => {}], ["", ""])}  >THE alert</TestDialog>))
.add("confirm - OK_CLOSE", () => (<TestDialog type={DialogType.confirm} show buttons={() => DialogButton(ButtonType.OkClose, [() => {}], ["", ""])}  >THE alert</TestDialog>))
.add("confirm - NO_YES", () => (<TestDialog type={DialogType.confirm} show buttons={() => DialogButton(ButtonType.NoYes, [() => {}], ["", ""])}  >THE alert</TestDialog>))
.add("confirm - YES_NO", () => (<TestDialog type={DialogType.confirm} show buttons={() => DialogButton(ButtonType.YesNo, [() => {}], ["", ""])}  >THE alert</TestDialog>))
.add("Custom", () => (<TestDialog type={DialogType.Other} show buttons={() => customButtons}  >THE alert</TestDialog>));

const customButtons:Array<IButton> = [
    {label: "Greet", className: "main-button", onClick: () => console.log("Hi kay")}
]