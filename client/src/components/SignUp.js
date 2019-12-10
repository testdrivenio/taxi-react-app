import React, { useState } from 'react';
import axios from 'axios';
import { Formik } from 'formik';
import {
  Breadcrumb, Button, Card, Col, Form, Row
} from 'react-bootstrap';
import { Link, Redirect } from 'react-router-dom';

function SignUp (props) {
  const [isSubmitted, setSubmitted] = useState(false);

  const onSubmit = async (values, actions) => {
    const url = '/api/sign_up/';
    const formData = new FormData();
    formData.append('username', values.username);
    formData.append('first_name', values.firstName);
    formData.append('last_name', values.lastName);
    formData.append('password1', values.password);
    formData.append('password2', values.password);
    formData.append('group', values.group);
    formData.append('photo', values.photo);
    try {
      await axios.post(url, formData);
      setSubmitted(true);
    }
    catch (response) {
      const data = response.response.data;
      for (const value in data) {
        actions.setFieldError(value, data[value].join(' '));
      }
    }
    finally {
      actions.setSubmitting(false);
    }
  };

  if (isSubmitted) {
    return <Redirect to='/log-in' />
  }

  return (
    <Row>
      <Col lg={12}>
        <Breadcrumb>
          <Breadcrumb.Item href='/'>Home</Breadcrumb.Item>
          <Breadcrumb.Item active>Sign up</Breadcrumb.Item>
        </Breadcrumb>
        <Card className='mb-3'>
          <Card.Header>Sign up</Card.Header>
          <Card.Body>
            <Formik
              initialValues={{
                username: '',
                firstName: '',
                lastName: '',
                password: '',
                group: 'rider',
                photo: []
              }}
              onSubmit={onSubmit}
            >
              {({
                errors,
                handleChange,
                handleSubmit,
                isSubmitting,
                setFieldValue,
                values
              }) => (
                <Form noValidate onSubmit={handleSubmit}>
                  <Form.Group controlId='username'>
                    <Form.Label>Username:</Form.Label>
                    <Form.Control
                      className={ 'username' in errors ? 'is-invalid' : '' }
                      name='username'
                      onChange={handleChange}
                      values={values.username}
                      required
                    />
                    {
                      'username' in errors &&
                      <Form.Control.Feedback type='invalid'>{ errors.username }</Form.Control.Feedback>
                    }
                  </Form.Group>
                  <Form.Group controlId='firstName'>
                    <Form.Label>First name:</Form.Label>
                    <Form.Control
                      className={ 'firstName' in errors ? 'is-invalid' : '' }
                      name='firstName'
                      onChange={handleChange}
                      values={values.firstName}
                    />
                    {
                      'firstName' in errors &&
                      <Form.Control.Feedback type='invalid'>{ errors.firstName }</Form.Control.Feedback>
                    }
                  </Form.Group>
                  <Form.Group controlId='lastName'>
                    <Form.Label>Last name:</Form.Label>
                    <Form.Control
                      className={ 'lastName' in errors ? 'is-invalid' : '' }
                      name='lastName'
                      onChange={handleChange}
                      values={values.lastName}
                    />
                    {
                      'lastName' in errors &&
                      <Form.Control.Feedback type='invalid'>{ errors.lastName }</Form.Control.Feedback>
                    }
                  </Form.Group>
                  <Form.Group controlId='password'>
                    <Form.Label>Password:</Form.Label>
                    <Form.Control
                      className={ 'password' in errors ? 'is-invalid' : '' }
                      name='password'
                      onChange={handleChange}
                      type='password'
                      value={values.password}
                    />
                    {
                      'password' in errors &&
                      <Form.Control.Feedback type='invalid'>{ errors.password }</Form.Control.Feedback>
                    }
                  </Form.Group>
                  <Form.Group controlId='group'>
                    <Form.Label>Group:</Form.Label>
                    <Form.Control
                      as='select'
                      className={ 'group' in errors ? 'is-invalid' : '' }
                      name='group'
                      onChange={handleChange}
                      value={values.group}
                    >
                      <option value='rider'>Rider</option>
                      <option value='driver'>Driver</option>
                    </Form.Control>
                    {
                      'group' in errors &&
                      <Form.Control.Feedback type='invalid'>{ errors.group }</Form.Control.Feedback>
                    }
                  </Form.Group>
                  <Form.Group controlId='photo'>
                    <Form.Label>Photo:</Form.Label>
                    <Form.Control
                      className={ 'photo' in errors ? 'is-invalid' : '' }
                      name='photo'
                      onChange={event => {
                        setFieldValue('photo', event.currentTarget.files[0]);
                      }}
                      type='file'
                    />
                    {
                      'photo' in errors &&
                      <Form.Control.Feedback type='invalid'>{ errors.photo }</Form.Control.Feedback>
                    }
                  </Form.Group>
                  <Button block type='submit' variant='primary'>Sign up</Button>
                </Form>
              )}
            </Formik>
          </Card.Body>
          <p className='mt-3 text-center'>
            Already have an account? <Link to='/log-in'>Log in!</Link>
          </p>
        </Card>
      </Col>
    </Row>
  );
}

export default SignUp;