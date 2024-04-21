import React from 'react'
import {Container, Row, Col} from 'react-bootstrap'
const currentYear = new Date().getFullYear()

const Footer = () => {
  return (
    <footer>
      <Container>
        <Row>
          <Col className='text-center py-3'>
            &copy; AptekaLandysh.ru {currentYear}
          </Col>
        </Row>
      </Container>
    </footer>
  )
}

export default Footer