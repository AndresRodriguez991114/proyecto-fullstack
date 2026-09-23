import { fireEvent, render, screen, waitFor } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import LoginForm from './Paginas/LoginForm';
import api from './api';

jest.mock('./api', () => ({
  __esModule: true,
  default: {
    post: jest.fn(),
  },
}));

test('muestra estado de carga mientras se procesa el login', async () => {
  api.post.mockImplementation(
    () =>
      new Promise((resolve) => {
        setTimeout(() => {
          resolve({
            data: {
              token: 'abc123',
              user: {
                nombre: 'Admin',
                email: 'admin@correo.com',
                rol: 'administrador',
              },
            },
          });
        }, 50);
      })
  );

  render(
    <MemoryRouter>
      <LoginForm />
    </MemoryRouter>
  );

  fireEvent.change(screen.getByPlaceholderText('Email ID'), {
    target: { value: 'admin@correo.com' },
  });
  fireEvent.change(screen.getByPlaceholderText('Password'), {
    target: { value: '12345678' },
  });

  fireEvent.click(screen.getByRole('button', { name: /login/i }));

  expect(screen.getByRole('button', { name: /iniciando/i })).toBeDisabled();

  await waitFor(() => {
    expect(api.post).toHaveBeenCalledWith('/usuarios/login', {
      email: 'admin@correo.com',
      password: '12345678',
    });
  });
});
