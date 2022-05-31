import React from 'react';
import { Navbar, Nav, NavDropdown} from 'react-bootstrap';
import Container from 'react-bootstrap/Container';
import photo from "../BGCLogo-_Hex_004B91.svg";
import { getStatus } from '../util/getStatus';

export default function () {
    function handleCleanStorage() {
        localStorage.setItem("barcode", "")
    }
    var status = getStatus();
    return (
        (status == "a") ? (
            <Container>
                <Navbar bg="light" expand="lg">
                    <Navbar.Brand onClick={handleCleanStorage} href="/">{<div> <img src={photo} height="45" width="45" alt="LOGO" /> </div>}
                    </Navbar.Brand>
                    <Navbar.Toggle aria-controls="basic-navbar-nav" />
                    <Navbar.Collapse id="basic-navbar-nav">
                        <Nav className="me-auto">
                            <Nav.Link href="/">Home</Nav.Link>
                            <NavDropdown title="Other" id="basic-nav-dropdown">
                                <NavDropdown.Item onClick={handleCleanStorage} href="/yourequip">Your Equipment</NavDropdown.Item>
                                <NavDropdown.Item onClick={handleCleanStorage} href="/SearchEquip">Search Equipment</NavDropdown.Item>
                                <NavDropdown.Item onClick={handleCleanStorage} href="/SearchUser">Search Users</NavDropdown.Item>
                                <NavDropdown.Divider />
                                <NavDropdown.Item onClick={handleCleanStorage} href="/BarcodeScan">Add Equipment</NavDropdown.Item>
                                <NavDropdown.Item onClick={handleCleanStorage} href="/Signup">Add User</NavDropdown.Item>
                                <NavDropdown.Divider />
                                <NavDropdown.Item onClick={handleCleanStorage} href="/RequestEquip">Request Equipment</NavDropdown.Item>
                                <NavDropdown.Item onClick={handleCleanStorage} href="/manageRequests">Check Out</NavDropdown.Item>
                                <NavDropdown.Item onClick={handleCleanStorage} href="/CheckIn">Check In</NavDropdown.Item>
                            </NavDropdown>
                        </Nav>
                    </Navbar.Collapse>
                </Navbar>
            </Container>

        ) : ((status == "e") ? (
            <Container>
                <Navbar bg="light" expand="lg">
                    <Navbar.Brand onClick={handleCleanStorage} href="/">{<div> <img src={photo} height="45" width="45" alt="LOGO" /> </div>}</Navbar.Brand>
                    <Navbar.Toggle aria-controls="basic-navbar-nav" />
                    <Navbar.Collapse id="basic-navbar-nav">
                        <Nav className="me-auto">
                            <Nav.Link href="/">Home</Nav.Link>
                            <NavDropdown title="Other" id="basic-nav-dropdown">
                                <NavDropdown.Item onClick={handleCleanStorage} href="/yourequip">Your Equipment</NavDropdown.Item>
                                <NavDropdown.Item onClick={handleCleanStorage} href="/SearchEquip">Search Equipment</NavDropdown.Item>
                                <NavDropdown.Item onClick={handleCleanStorage} href="/BarcodeScan">Add Equipment</NavDropdown.Item>
                                <NavDropdown.Divider />
                                <NavDropdown.Item onClick={handleCleanStorage} href="/RequestEquip">Request Equipment</NavDropdown.Item>
                                <NavDropdown.Item onClick={handleCleanStorage} href="/manageRequests">Check Out</NavDropdown.Item>
                                <NavDropdown.Item onClick={handleCleanStorage} href="/CheckIn">Check In</NavDropdown.Item>
                            </NavDropdown>
                        </Nav>
                    </Navbar.Collapse>
                </Navbar>
            </Container>

        ) : (
            <Container>
                <Navbar bg="light" expand="lg">
                    <Navbar.Brand onClick={handleCleanStorage} href="/">{<div> <img src={photo} height="45" width="45" alt="LOGO" /> </div>}
                    </Navbar.Brand>
                    <Navbar.Toggle aria-controls="basic-navbar-nav" />
                    <Navbar.Collapse id="basic-navbar-nav">
                        <Nav className="me-auto">
                            <Nav.Link href="/">Home</Nav.Link>
                            <NavDropdown title="Other" id="basic-nav-dropdown">
                                <NavDropdown.Item onClick={handleCleanStorage} href="/yourequip">Your Equipment</NavDropdown.Item>
                                <NavDropdown.Item onClick={handleCleanStorage} href="/SearchEquip">Search Equipment</NavDropdown.Item>
                                <NavDropdown.Item onClick={handleCleanStorage} href="/RequestEquip">Request Equipment</NavDropdown.Item>
                            </NavDropdown>
                        </Nav>
                    </Navbar.Collapse>
                </Navbar>
            </Container>
        ))
    );


}
