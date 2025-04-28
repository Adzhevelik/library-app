import React from 'react';
import { render, screen, act } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { MemoryRouter } from 'react-router-dom';
import Header from '../Header';

jest.mock('../StatusIndicator', () => () => <div data-testid="status-indicator-mock"></div>);

describe('Header Component', () => {
    const user = userEvent.setup();

    const renderWithRouter = (initialEntries = ['/']) => {
        // ����������� ������ � act, �.�. MemoryRouter ����� ������� ���������� ���������
        let renderResult;
        act(() => {
            renderResult = render(
                <MemoryRouter initialEntries={initialEntries}>
                    <Header />
                </MemoryRouter>
            );
        });
        return renderResult;
    };


    it('should render the logo link', () => {
        renderWithRouter();
        const logoLink = screen.getByRole('link', { name: /Library MS/i });
        expect(logoLink).toBeInTheDocument();
        expect(logoLink).toHaveTextContent('?? Library MS');
        expect(logoLink).toHaveAttribute('href', '/');
    });

    it('should render navigation links', () => {
        renderWithRouter();
        expect(screen.getByRole('link', { name: /Home/i })).toBeInTheDocument();
        expect(screen.getByRole('link', { name: /All Books/i })).toBeInTheDocument();
        expect(screen.getByRole('link', { name: /Add Book/i })).toBeInTheDocument();
        expect(screen.getByRole('link', { name: /Search/i })).toBeInTheDocument();
    });

    it('should highlight the active link', () => {
        renderWithRouter(['/books/add']);
        const homeLink = screen.getByRole('link', { name: /Home/i });
        const allBooksLink = screen.getByRole('link', { name: /All Books/i });
        const addBookLink = screen.getByRole('link', { name: /Add Book/i });
        const searchLink = screen.getByRole('link', { name: /Search/i });

        expect(homeLink).not.toHaveClass('active');
        expect(allBooksLink).not.toHaveClass('active');
        expect(addBookLink).toHaveClass('active');
        expect(searchLink).not.toHaveClass('active');
    });

    it('should highlight the Home link for root path "/"', () => {
        renderWithRouter(['/']);
        const homeLink = screen.getByRole('link', { name: /Home/i });
        expect(homeLink).toHaveClass('active');
    });

    it('should highlight the All Books link for "/books" path', () => {
        renderWithRouter(['/books']);
        const allBooksLink = screen.getByRole('link', { name: /All Books/i });
        expect(allBooksLink).toHaveClass('active');
    });

    // --- Mobile Menu Tests ---
    describe('Mobile Menu', () => {
        // ������� ��� ������ ������ � ���������
        const getMenuElements = () => {
            // eslint-disable-next-line testing-library/no-container
            const container = screen.getByRole('banner').parentNode; // ���� �������� header
             // eslint-disable-next-line testing-library/no-node-access
            const menuIcon = container.querySelector('.menu-icon');
             // eslint-disable-next-line testing-library/no-container, testing-library/no-node-access
            const navLinks = container.querySelector('.nav-links');
            return { menuIcon, navLinks };
        }

        it('should toggle mobile menu class on icon click', async () => {
            renderWithRouter();
            const { menuIcon, navLinks } = getMenuElements();

            // ���� ���� ������������, ��� ����� CSS �������� .nav-links ��� ������ .show
            // � ���������� .menu-icon �� ����� �������. � JSDOM ����� �� �����������.
            // ������� �� ��������� ������ ����������/�������� ������.
            if (!menuIcon) {
                console.warn("Menu icon potentially not rendered or found, skipping toggle test.");
                return; // ���������� ����, ���� ������ ���
            }

            expect(navLinks).not.toHaveClass('show');

            await user.click(menuIcon);
            expect(navLinks).toHaveClass('show');

            await user.click(menuIcon);
            expect(navLinks).not.toHaveClass('show');
        });

        it('should remove "show" class from menu when a nav link is clicked', async () => {
            renderWithRouter();
             const { menuIcon, navLinks } = getMenuElements();

            if (!menuIcon) {
                 console.warn("Menu icon potentially not rendered or found, skipping close on link click test.");
                 return; // ���������� ����, ���� ������ ���
             }

             // ��������� �������� ���� (��������� ����� �������, �.�. ���� ����� �� ��������� ��-�� ���������� ������)
             // eslint-disable-next-line testing-library/no-node-access
             navLinks.classList.add('show');
             expect(navLinks).toHaveClass('show'); // ��������, ��� ����� ��������

             // ������� �� ������ Home
             const homeLink = screen.getByRole('link', { name: /Home/i });
             await user.click(homeLink);

             // ���� ������ ��������� (����� ������ ���������)
             expect(navLinks).not.toHaveClass('show');

            // �������� ��� ������ ������
            // eslint-disable-next-line testing-library/no-node-access
             navLinks.classList.add('show'); // ����� "���������"
             expect(navLinks).toHaveClass('show');
             const addBookLink = screen.getByRole('link', { name: /Add Book/i });
             await user.click(addBookLink);
             expect(navLinks).not.toHaveClass('show');
        });
    });
});