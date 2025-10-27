import { render, screen, waitFor } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import App from './App.tsx';
import { describe, it, expect } from 'vitest';

describe('App', () => {
  it('should render the admin dashboard on the correct route', async () => {
    // Arrange
    render(
      <MemoryRouter initialEntries={['/admin/dashboard']}>
        <App />
      </MemoryRouter>
    );

    // Act & Assert
    // Wait for the dashboard content to appear after the loading state
    expect(await screen.findByText('Dashboard de Rendimiento')).toBeInTheDocument();
  });

  it('should render the Not Found page for a non-existent route', () => {
    // Arrange
    render(
      <MemoryRouter initialEntries={['/some-non-existent-route']}>
        <App />
      </MemoryRouter>
    );

    // Act & Assert
    expect(screen.getByText('404 - Not Found')).toBeInTheDocument();
    expect(screen.queryByText('Dashboard de Rendimiento')).not.toBeInTheDocument();
  });
});
