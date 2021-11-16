import React from "react";
import {storiesOf} from "@storybook/react";
import { Table } from './Table';

storiesOf("Table", module)
.add("Default", () => (<Table onChange={() => {}} onComponentChange={() => <div>My Favorite Component</div>} title={["SN", "Name", "Gender"]} data={TEST_DATA} perPage={12} total={2} useCheckboxSelect />))


const TEST_DATA = [
    {id: 1, name: "Oyediran Ayomide", gender: "Male"},
    {id: 2, name: "Oyediran Funbi", gender: "Female"}
]