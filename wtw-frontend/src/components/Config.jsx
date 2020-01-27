import React, { Component } from 'react';
import { Container, Row, Breadcrumb, BreadcrumbItem } from 'react-bootstrap';
import SliderCustomRange from './Slider';
import MyContext from './MyContext'

class Config extends Component {
    constructor(props, context){
        super(props, context)
        this.state = {
            poids: context.state.poids_max,
            angle: context.state.angle_max
        }
    }

    render() {
        return (
            <Container>
                <Row>
                    <Breadcrumb style={{ width: '100%' }} className="mt-4">
                        <BreadcrumbItem active>
                            Réglages des capteurs
                        </BreadcrumbItem>
                    </Breadcrumb>
                    
                    <Container>
                        <br />
                        <SliderCustomRange label={'Poids'} max={100} value={this.state.poids}/>
                        <br />
                        <SliderCustomRange  label={'Angle'} max={200} value={this.state.angle}/>
                    </Container>
                </Row>

            </Container>
        );
    }
}

Config.contextType = MyContext;

export default Config;