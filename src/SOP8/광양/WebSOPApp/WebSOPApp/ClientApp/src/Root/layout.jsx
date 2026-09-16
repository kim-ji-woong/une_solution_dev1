import React from 'react';
import { Container } from 'reactstrap';
import TitleBar from './titleBar';

function Layout(props) {

    return (
        <main id="main">
            <TitleBar
                menuEvent={props.menuEvent} 
                target={props.target}
            />
            <Container id="layoutContainer">
                {props.children}
            </Container>
        </main>
    );
}

export default Layout;