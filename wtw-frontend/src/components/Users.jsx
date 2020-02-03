import React, { Component } from 'react';
import { Container, Button, Row, Accordion, Form, Col } from "react-bootstrap";
import MyContext from './MyContext';
import api from '../api'
import qs from 'querystring'

class Users extends Component {
    constructor(props, context) {
        super(props, context);
        this.state = {
            session: context.state.session,
            patient: context.state.patient,
            patients: [],
            nom: '',
            prenom: ''
        }
        this.updateSession = context.updateSession.bind(this);
        this.isActive = this.isActive.bind(this);
        this.session = this.session.bind(this);
    }

    isActive = value => {
        return 'mr-3 mb-3 ' + ((value._id === this.state.patient._id) ? 'active' : 'default');
    }

    session = user => {
        this.updateSession(user)
        this.setState({ patient: user })
    }

    infoPatient = () => {
        return (
            <Container className="mt-4">
                <h1>{this.state.patient.nom} {this.state.patient.prenom}</h1>
                <p>Mes supers infos maggle</p>
                <Row className="ml-auto">
                    <Button variant="danger"
                        onClick={() =>
                            window.confirm("Voulez vous vraiment supprimer ce patient?") &&
                            this.handleDeleteUser()
                        }
                    >
                        Supprimer
                    </Button>
                </Row>
            </Container>
        )
    }

    componentDidMount = async () => {
        await api.getAllUsers().then(resp => {
            resp.data.map(user =>
                this.setState(prevState => ({
                    patients: [...prevState.patients, user]
                }))
            )
        })
    }

    handleInsertUser = async () => {
        const payload = {
            nom: this.state.nom,
            prenom: this.state.prenom
        }

        await api.insertUser(qs.stringify(payload)).then(resp => {
            if (resp.data.success) {
                this.setState({
                    nom: '',
                    prenom: ''
                })
                window.location.reload();
            } else alert(resp.data.msg)
        })
    }

    handleDeleteUser = async () => {
        await api.deleteUser(this.state.patient._id).then(resp => {resp.data.success ? window.location.reload() : alert(resp.data.msg)})
    }

    render() {
        return (
            <Container className="mt-4">
                <Row>
                    <Button
                        className={this.isActive({ _id: '' })} onClick={() => this.session({ _id: '' })}
                        variant="outline-secondary"
                    >
                        Sans patient
                    </Button>

                    {this.state.patients.map(patient => {
                        return <Button
                            className={this.isActive(patient)} onClick={() => this.session(patient)}
                            key={patient._id} variant="outline-primary"
                        > {patient.nom} {patient.prenom}
                        </Button>
                    })}

                </Row>

                <Accordion>
                    <Row className="mt-4 flex-row-reverse">
                        <Accordion.Toggle as={Button} variant="primary" eventKey="0">+ Ajout patient</Accordion.Toggle>
                    </Row>
                    <Row>
                        <Accordion.Collapse eventKey="0" className="w-100">
                            <Form>
                                <Form.Group>
                                    <Row>
                                        <Col md={6}>
                                            <Form.Label>Nom</Form.Label>
                                            <Form.Control required type="name" onChange={(e) => this.setState({ nom: e.target.value })} />
                                        </Col>
                                        <Col md={6}>
                                            <Form.Label>Prénom</Form.Label>
                                            <Form.Control required type="name" onChange={(e) => this.setState({ prenom: e.target.value })} />
                                        </Col>
                                    </Row>

                                </Form.Group>
                                <Button variant="primary" onClick={this.handleInsertUser}>
                                    Ajouter
                                </Button>
                            </Form>
                        </Accordion.Collapse>
                    </Row>
                </Accordion>

                {this.state.patient.nom ? this.infoPatient() : null}

            </Container>
        );
    }
}

Users.contextType = MyContext

export default Users;