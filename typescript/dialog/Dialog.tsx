import { useDispatch, useSelector } from "react-redux";
import "./dialog.scss";
import { IButtonProps, TCallback } from '../Interfaces';
import { closeDialog } from "./dialog.reducer";
import { useEffect } from "react";


export let dispatcher:any;
let keyHolder: string[] = [];
export interface IButton extends IButtonProps {
    label: string;
    pause?: true | false;
    onClick: (confirmed: boolean) => void;
    classNames?: string;
}

export interface IProps {
    type?: any,
    title?: any,
    message?: any,
    children?: any,
    firstButtonOnClick?: TCallback,
    secondButtonOnClick?: TCallback,
    show: boolean
}

export interface IShowBoxProps {
    content?: any;
    onClose?: () => boolean;
    show: boolean;
    header?: string;
}

export interface IDialogProps extends IProps, IShowBoxProps {
    buttons: () => Array<IButton>,
}

export const ReducerData = {
    stateKey: "DialogReducerKey",
    actionType: "UpdateDialog"
};

export const DialogType = {
    alert: "alert",
    confirm: "confirm",
    Other: "other"
}

export const ButtonType = {
    OK: "ok",
    YesNo: "YesNo",
    NoYes: "NoYes",
    OkCancel: "OkCancel",
    OkClose: "OkClose",
    Close: "close"
}

export const DialogButton = (type: string, functions: Array<TCallback | undefined>, classNames: Array<string>): Array<IButton> => {
    const dummy = () => {};
    const btn = {label: "Ok", onClick: functions[0] || dummy, className: "main-button " + classNames[0]};

    switch (type) {
        case ButtonType.OK:
            return [btn];    
        case ButtonType.Close:
            return [{...btn, label: "Close"}];
        case ButtonType.YesNo:
            return [{...btn, label: "Yes"}, {label: "No", onClick: functions[1] || dummy, className:"optional-button " + classNames[1]}];
        case ButtonType.NoYes:
            return [{...btn, label: "No", className: "optional-button " +classNames[0]}, {label: "Yes", onClick: functions[1] || dummy, className:"main-button " + classNames[1]}];
        case ButtonType.OkCancel:
            return [btn, {label: "Cancel", onClick: functions[1] || dummy, className:"optional-button " + classNames[1]}];
        case ButtonType.OkClose:
            return [btn, {label: "Close", onClick: functions[1] || dummy, className:"optional-button " + classNames[1]}];    
        default:
            return [];
    }
}

export const Modal = () => {
    const props: IDialogProps = useSelector((state:any) => state[ReducerData.stateKey]);
    dispatcher = useDispatch();

    return(
        <div className={props.show? "modal show" : "modal"}>{props.message || props.children}</div>
    )
}

export const TestModal = (props: IProps) => {
    return(
        <div className={props.show? "modal show" : "modal"}>{props.message || props.children}</div>
    )
}

export const ShowDialog = (props: IDialogProps) => {

    const handleClick = (btn: IButton, index: number) => {
        if(typeof btn.onClick === "function") {
            btn.onClick(index > 0);
        }
        if(!btn.pause) {
            props.onClose? (props.onClose() && closeDialog()) : closeDialog();
        }
    }

    useEffect(() => {
        document.onkeydown = (e) => {
            if (e.key === "Shift" && !keyHolder[0]) {
                keyHolder[0] = e.key;
                return;
            }

            if(keyHolder[0] && keyHolder[0].length > 0) {
                if( e.key === "Escape") {
                    closeDialog();
                }
                else if (e.key === "Enter") {
                    //Trigger on click
                    if(props.buttons()[1]) {
                        handleClick(props.buttons()[1], 1);
                    }
                    else {
                        props.buttons()[0] && handleClick(props.buttons()[0], 0);
                    }
                }
                keyHolder = [];
            }
        }
        return () => {
            keyHolder = [];
        }
    });

    return(
        <div className={props.show? "overlay show" : "overlay"}>
            <div className="dialog-alert">
                <div className="dialog-title">{props.title}</div>
                <div className="dialog-content">{props.message}</div>
                <div className="dialog-buttons">
                    {
                        props.buttons().map((btn, index) => (
                            <button key={index} className={"dialog-button " + btn.className} onClick={handleClick.bind(null, btn, index)} >{btn.label}</button>
                        ))
                    }
                </div>
            </div>
        </div>
    )
}

export const ShowDialogBox = (props: IShowBoxProps) => {

    const handleClick = () => {
        closeDialog();
        props.onClose && props.onClose();
    }

    useEffect(() => {
        document.onkeyup = (e) => {
            if(e.key === "Escape") {
                closeDialog();
            }
        }
    });

    return(
        <div className={props.show? "overlay show" : "overlay"}>
            <div className="dialog-alert">
                <div className="dialog-title c-right" onClick={handleClick}><span style={{cursor: "pointer"}}>x</span></div>
                <div className="dialog-content">{props.content}</div>
            </div>
        </div>
    )
}

function Dialog() {
    
    const state: any = useSelector(state => state);
    dispatcher = useDispatch();
    const props: IDialogProps = state[ReducerData.stateKey];

    switch(props.type){
        case DialogType.alert:
        case DialogType.confirm:
            return <ShowDialog {...props}  />;
        case DialogType.Other:
            return <ShowDialogBox header={props.header} show={props.show} content={props.content} onClose={props.onClose} />;
        default:
            return <Modal />
    }
}
export default Dialog;


export function TestDialog(props: IDialogProps) {

    switch(props.type){
        case DialogType.alert:
        case DialogType.confirm:
            return <ShowDialog {...props}  />
        case DialogType.Other:
            return <ShowDialogBox header={props.header} show={props.show} content={props.content} onClose={props.onClose} />;
        default:
            return <TestModal {...props} />
    }
}
