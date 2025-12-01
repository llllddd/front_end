import { createContext } from 'react';

export interface LoginContextType {
    authenticated: boolean;
    orcid?: string;
    name?: string;
    email?: string;
    organization?: string;
    role?: string;
    status?: string; 
    setLogin: (values: Partial<LoginContextType>) => void;
}

const LoginContext = createContext<LoginContextType>({
    authenticated: false,
    orcid: undefined,
    name: undefined,
    email: undefined,
    organization: undefined,
    role: undefined,
    status: undefined,
    setLogin: () => {},
});

export default LoginContext;

