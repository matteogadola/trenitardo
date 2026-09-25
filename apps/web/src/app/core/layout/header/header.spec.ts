import { ComponentFixture, TestBed } from '@angular/core/testing';
import { provideRouter } from '@angular/router';
import { AuthService } from '@app/core/auth/auth-service';

import { Header } from './header';

describe('Header', () => {
  let component: Header;
  let fixture: ComponentFixture<Header>;

  const authMock = {
    isAuthenticated: vi.fn(() => false),
    user: vi.fn((): { displayName?: string; email?: string } | null => null),
    signOut: vi.fn(() => Promise.resolve()),
  };

  async function setup(): Promise<void> {
    await TestBed.configureTestingModule({
      imports: [Header],
      providers: [provideRouter([]), { provide: AuthService, useValue: authMock }],
    }).compileComponents();

    fixture = TestBed.createComponent(Header);
    component = fixture.componentInstance;
    fixture.detectChanges();
    await fixture.whenStable();
  }

  beforeEach(() => {
    authMock.isAuthenticated.mockReset();
    authMock.user.mockReset();
    authMock.signOut.mockReset();
    authMock.isAuthenticated.mockReturnValue(false);
    authMock.user.mockReturnValue(null);
    authMock.signOut.mockResolvedValue(undefined);
  });

  it('should create', async () => {
    await setup();
    expect(component).toBeTruthy();
  });

  it('mostra "Accedi" se anonimo', async () => {
    await setup();
    expect(fixture.nativeElement.textContent).toContain('Accedi');
    expect(fixture.nativeElement.textContent).not.toContain('Esci');
  });

  it('mostra utente e logout se autenticato', async () => {
    authMock.isAuthenticated.mockReturnValue(true);
    authMock.user.mockReturnValue({ displayName: 'Mario', email: 'mario@example.com' });

    await setup();

    expect(fixture.nativeElement.textContent).toContain('Mario');

    (fixture.nativeElement.querySelector('button') as HTMLButtonElement).click();
    await fixture.whenStable();

    expect(authMock.signOut).toHaveBeenCalledOnce();
  });
});
