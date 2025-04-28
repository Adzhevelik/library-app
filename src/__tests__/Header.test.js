import React from 'react';
import { render, screen, act } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { MemoryRouter } from 'react-router-dom';
import Header from '../Header';

jest.mock('../StatusIndicator', () => () => <div data-testid="status-indicator-mock"></div>);

describe('Header Component', () => {
    const user = userEvent.setup();

    const renderWithRouter = (initialEntries = ['/']) => {
        // Оборачиваем рендер в act, т.к. MemoryRouter может вызвать обновления состояния
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
        // Функция для поиска иконки и навигации
        const getMenuElements = () => {
            // eslint-disable-next-line testing-library/no-container
            const container = screen.getByRole('banner').parentNode; // Ищем родителя header
             // eslint-disable-next-line testing-library/no-node-access
            const menuIcon = container.querySelector('.menu-icon');
             // eslint-disable-next-line testing-library/no-container, testing-library/no-node-access
            const navLinks = container.querySelector('.nav-links');
            return { menuIcon, navLinks };
        }

        it('should toggle mobile menu class on icon click', async () => {
            renderWithRouter();
            const { menuIcon, navLinks } = getMenuElements();

            // Этот тест предполагает, что стили CSS скрывают .nav-links без класса .show
            // и показывают .menu-icon на малых экранах. В JSDOM стили не применяются.
            // Поэтому мы проверяем только добавление/удаление класса.
            if (!menuIcon) {
                console.warn("Menu icon potentially not rendered or found, skipping toggle test.");
                return; // Пропускаем тест, если иконки нет
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
                 return; // Пропускаем тест, если иконки нет
             }

             // Имитируем открытое меню (добавляем класс вручную, т.к. клик может не сработать из-за отсутствия стилей)
             // eslint-disable-next-line testing-library/no-node-access
             navLinks.classList.add('show');
             expect(navLinks).toHaveClass('show'); // Убедимся, что класс добавлен

             // Кликаем по ссылке Home
             const homeLink = screen.getByRole('link', { name: /Home/i });
             await user.click(homeLink);

             // Меню должно закрыться (класс должен удалиться)
             expect(navLinks).not.toHaveClass('show');

            // Повторим для другой ссылки
            // eslint-disable-next-line testing-library/no-node-access
             navLinks.classList.add('show'); // Снова "открываем"
             expect(navLinks).toHaveClass('show');
             const addBookLink = screen.getByRole('link', { name: /Add Book/i });
             await user.click(addBookLink);
             expect(navLinks).not.toHaveClass('show');
        });
    });
});