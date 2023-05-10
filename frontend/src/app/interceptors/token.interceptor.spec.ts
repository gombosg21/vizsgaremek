import { TestBed } from '@angular/core/testing';
import { TokenInterceptor } from './token.interceptor';

describe('AuthService', () => {
    let interceptor: TokenInterceptor;

    beforeEach(() => {
        TestBed.configureTestingModule({});
        interceptor = TestBed.inject(TokenInterceptor);
    });

    it('should be created', () => {
        expect(interceptor).toBeTruthy();
    });
});