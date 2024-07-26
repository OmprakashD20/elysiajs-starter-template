# ElysiaJS Template with Lucia, Drizzle, and PostgreSQL

## Overview

This template provides a robust starting point for building web applications using ElysiaJS, with comprehensive authentication handled by Lucia, database operations managed by Drizzle ORM, and PostgreSQL as the database.

## Features

- **ElysiaJS**: A fast, and friendly web framework for Bun
- **Lucia**: For handling authentication
- **Drizzle ORM**: Type-safe ORM for TypeScript
- **PostgreSQL**: Powerful, open-source relational database
- **Authentication Features**:
  - Email and password authentication
  - Email verification
  - Password reset functionality
  - OAuth integration with Google and GitHub

## Status

The development of this template has reached the following milestones:

- [x] Basic project structure and conventions
- [x] Environment configuration
- [x] Basic ElysiaJS setup
- [x] Drizzle ORM setup and basic schema
- [x] PostgreSQL connection and configuration
- [x] Integration with Lucia for authentication
  - [x] Lucia auth setup
  - [x] Email and password authentication
  - [x] Email verification
  - [x] Password reset functionality
  - [x] OAuth with Google
  - [x] OAuth with GitHub

## Authentication

This template uses Lucia for authentication, providing a comprehensive set of features:

1. **Email and Password Authentication**: Traditional sign-up and login functionality.
2. **Email Verification**: Ensure user emails are valid and reduce spam accounts.
3. **Password Reset**: Allow users to securely reset their passwords.
4. **OAuth Integration**: 
   - Google: Enable users to sign in with their Google accounts.
   - GitHub: Allow developers to sign in using their GitHub credentials.

## Planned Features

In the future, the following features are planned for implementation:

1. **Auth using Web Passkeys**: Enhance security by enabling authentication using WebAuthn passkeys.
2. **Auth using Magic Link**: Simplify the login process by allowing users to authenticate via magic links sent to their email.
3. **Role-Based Authentication**: Implement role-based access control to secure routes and features based on user roles.
4. **tRPC**: Integrate tRPC to enable typesafe APIs for seamless client-server communication.

## Documentation

Documentation for this template is currently in development. Please check back for updates and detailed usage instructions.

## Stay Tuned

The project is under active development, and more features and improvements are on the way. Check back for updates on implementation details and usage instructions.