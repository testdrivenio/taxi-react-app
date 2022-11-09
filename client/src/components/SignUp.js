import React, { useState } from 'react';
import axios from 'axios';
import { Formik } from 'formik';
import {
  Breadcrumb, Button, Card, Form
} from 'react-bootstrap';
import { Link, Navigate } from 'react-router-dom';

function SignUp (props) {
  const [isSubmitted, setSubmitted] = useState(false);

  const onSubmit = async (values, actions) => {
    const url = `${process.env.REACT_APP_BASE_URL}/api/sign_up/`;
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
    } catch (response) {
      const data = response.response.data;
      for (const value in data) {
        actions.setFieldError(value, data[value].join(' '));
      }
    }
  };

  if (props.isLoggedIn) {
    return <Navigate to='/' />;
  }

  if (isSubmitted) {
    return <Navigate to='/log-in' />;
  }

  return (
    <>
      <Breadcrumb>
        <Breadcrumb.Item href='/#/'>Home</Breadcrumb.Item>
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
                <Form.Group className='mb-3' controlId='username'>
                  <Form.Label>Username:</Form.Label>
                  <Form.Control
                    className={'username' in errors ? 'is-invalid' : ''}
                    name='username'
                    onChange={handleChange}
                    required
                    values={values.username}
                  />
                  {
                    'username' in errors && (
                      <Form.Control.Feedback type='invalid'>{errors.username}</Form.Control.Feedback>
                    )
                  }
                </Form.Group>
                <Form.Group className='mb-3' controlId='firstName'>
                  <Form.Label>First name:</Form.Label>
                  <Form.Control
                    className={'firstName' in errors ? 'is-invalid' : ''}
                    name='firstName'
                    onChange={handleChange}
                    required
                    values={values.firstName}
                  />
                  {
                    'firstName' in errors && (
                      <Form.Control.Feedback type='invalid'>{errors.firstName}</Form.Control.Feedback>
                    )
                  }
                </Form.Group>
                <Form.Group className='mb-3' controlId='lastName'>
                  <Form.Label>Last name:</Form.Label>
                  <Form.Control
                    className={'lastName' in errors ? 'is-invalid' : ''}
                    name='lastName'
                    onChange={handleChange}
                    required
                    values={values.lastName}
                  />
                  {
                    'lastName' in errors && (
                      <Form.Control.Feedback type='invalid'>{errors.lastName}</Form.Control.Feedback>
                    )
                  }
                </Form.Group>
                <Form.Group className='mb-3' controlId='password'>
                  <Form.Label>Password:</Form.Label>
                  <Form.Control
                    className={'password1' in errors ? 'is-invalid' : ''}
                    name='password'
                    onChange={handleChange}
                    required
                    type='password'
                    value={values.password}
                  />
                  {
                    'password1' in errors && (
                      <Form.Control.Feedback type='invalid'>{errors.password1}</Form.Control.Feedback>
                    )
                  }
                </Form.Group>
                <Form.Group className='mb-3' controlId='group'>
                  <Form.Label>Group:</Form.Label>
                  <Form.Select
                    className={'group' in errors ? 'is-invalid' : ''}
                    name='group'
                    onChange={handleChange}
                    required
                    value={values.group}
                  >
                    <option value='rider'>Rider</option>
                    <option value='driver'>Driver</option>
                  </Form.Select>
                  {
                    'group' in errors && (
                      <Form.Control.Feedback type='invalid'>{errors.group}</Form.Control.Feedback>
                    )
                  }
                </Form.Group>
                <Form.Group className='mb-3' controlId='photo'>
                  <Form.Label>Photo:</Form.Label>
                  <Form.Control
                    className={'photo' in errors ? 'is-invalid' : ''}
                    name='photo'
                    onChange={event => {
                      setFieldValue('photo', event.currentTarget.files[0]);
                    }}
                    required
                    type='file'
                  />
                  {
                    'photo' in errors && (
                      <Form.Control.Feedback type='invalid'>{errors.photo}</Form.Control.Feedback>
                    )
                  }
                </Form.Group>
                <div className='d-grid mb-3'>
                  <Button
                    disabled={isSubmitting}
                    type='submit'
                    variant='primary'
                  >Sign up
                  </Button>
                </div>
              </Form>
            )}
          </Formik>
          <Card.Text className='text-center'>
            Already have an account? <Link to='/log-in'>Log in!</Link>
          </Card.Text>
        </Card.Body>
      </Card>
    </>
  );
}

export default SignUp;
