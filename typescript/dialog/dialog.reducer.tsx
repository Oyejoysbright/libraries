import React from 'react'

import {ButtonType, DialogButton, IDialogProps, ReducerData, IProps, dispatcher, DialogType} from "./Dialog";
import { TCallback } from '../Interfaces';

const clicked = () => {
    //
}

const currentState:IDialogProps = {
    type: "alert", 
    title: "My Title", 
    message: "Message", 
    content: "My dialog box", 
    show: true, 
    buttons:  () => DialogButton(ButtonType.NoYes, [clicked, clicked], [])};

export const DialogReducer = (state = currentState, action: any) => {
    return Object.assign({}, state, action.data) || state;
}

export const dialogEx = (args: IDialogProps) => {
    dispatcher({type: ReducerData.actionType, data: args});
}

export const modalEx = (args: IProps) => {
    dispatcher({type: ReducerData.actionType, data: {type: "modal", ...args}});
}

export const alertEx = (args: IProps) => {
    dispatcher({type: ReducerData.actionType, data: {type: DialogType.alert, show: true, title: args.title, message: args.message, buttons: () => DialogButton(ButtonType.OK, [clicked], [])}});
}

export const alert = (message: string, callback?: TCallback) => {
    dispatcher({type: ReducerData.actionType, data: {type: DialogType.alert, show: true, title: "alert", message: message, buttons: () => DialogButton(ButtonType.OK, [() => {callback!==undefined? callback() : clicked()}], [])}});
}

export const confirmEx = (args: IProps) => {
    dispatcher({type: ReducerData.actionType, data: {type: DialogType.confirm, show: true, title: args.title, message: args.message, buttons: () => DialogButton(ButtonType.NoYes, [args.firstButtonOnClick, args.secondButtonOnClick], ["",""])}});
}

export const confirm = (message: any, onConfirm: TCallback, onClose?: TCallback) => {
    dispatcher({type: ReducerData.actionType, data: {type: DialogType.confirm, show: true, title: "confirm", message: message, onClose: onClose, buttons: () => DialogButton(ButtonType.NoYes, [clicked, onConfirm], ["",""])}});
}

export const showDialogBox = (header: string | undefined | null, content: any, onClose: TCallback) => {
    dispatcher({type: ReducerData.actionType, data: {type: DialogType.Other, show: true, header: header, content: content, onClose: onClose}});
}

export const closeDialog = () => {
    dispatcher({type: ReducerData.actionType, data: {show: false}});
}

export const closeModal = () => {
    dispatcher({type: ReducerData.actionType, data: {show: false}});
}