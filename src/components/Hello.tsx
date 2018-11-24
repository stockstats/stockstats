import * as React from 'react';

export interface HelloProps {
    compiler: string;
    framework: string;
}

export const Hello = (props: HelloProps) => (
    <div>
        <h1>
            Hello! You, from {props.compiler} and {props.framework}!
        </h1>
        <button onClick={() => {alert('click');}}>
            {props.compiler}
        </button>
    </div>
);
