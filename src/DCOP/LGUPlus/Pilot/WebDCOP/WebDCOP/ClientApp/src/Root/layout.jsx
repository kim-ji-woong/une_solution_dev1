import React, { Component } from 'react';
import { Container } from 'reactstrap';
import TitleBar from '../Common/ui/titleBar';

class Layout extends Component {
    constructor(props) {
        super(props);

        this.state = {
        }
    }


    render() {
        
        return (
            <main id="main">
                <TitleBar menuEvent={this.props.menuEvent} target={this.props.target} />
                <Container id="layoutContainer">
                    {this.props.children}
                </Container>
            </main>
        );
    }
}

export default Layout;