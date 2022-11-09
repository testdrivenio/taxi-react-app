import React, { useState } from 'react';
import { Formik } from 'formik';
import {
  Alert, Breadcrumb, Button, Card, Form
} from 'react-bootstrap';
import { Link, Navigate } from 'react-router-dom';

function LogIn ({ isLoggedIn, logIn }) {
  const [isSubmitted, setSubmitted] = useState(false);

  const onSubmit = async (values, actions) => {
    try {
      const { response, isError } = await logIn(
        values.username,
        values.password
      );
      if (isError) {
        const data = response.response.data;
        for (const value in data) {
          actions.setFieldError(value, data[value].join(' '));
        }
      } else {
        setSubmitted(true);
      }
    }
    catch (error) {
      console.error(error);
    }
  }

  if (isLoggedIn || isSubmitted) {
    return <Navigate to='/' />;
  }

  return (
    <>
      <Breadcrumb>
        <Breadcrumb.Item href='/#/'>Home</Breadcrumb.Item>
        <Breadcrumb.Item active>Log in</Breadcrumb.Item>
      </Breadcrumb>
      <Card>
        <Card.Header>Log in</Card.Header>
        <Card.Body>
          <Formik
            initialValues={{
              username: '',
              password: ''
            }}
            onSubmit={onSubmit}
          >
            {({
              errors,
              handleChange,
              handleSubmit,
              isSubmitting,
              values
            }) => (
              <>
                {
                  '__all__' in errors && (
                    <Alert variant='danger'>
                      {errors.__all__}
                    </Alert>
                  )
                }
                <Form noValidate onSubmit={handleSubmit}>
                  <Form.Group className='mb-3' controlId='username'>
                    <Form.Label>Username:</Form.Label>
                    <Form.Control
                      name='username'
                      onChange={handleChange}
                      value={values.username}
                    />
                  </Form.Group>
                  <Form.Group className='mb-3' controlId='password'>
                    <Form.Label>Password:</Form.Label>
                    <Form.Control
                      name='password'
                      onChange={handleChange}
                      type='password'
                      value={values.password}
                    />
                  </Form.Group>
                  <div className='d-grid mb-3'>
                    <Button
                      disabled={isSubmitting}
                      type='submit'
                      variant='primary'
                    >Log in
                    </Button>
                  </div>
                </Form>
              </>
            )}
          </Formik>
          <Card.Text className='text-center'>
            Don't have an account? <Link to='/sign-up'>Sign up!</Link>
          </Card.Text>
        </Card.Body>
      </Card>
    </>
  );
}

export default LogIn;
