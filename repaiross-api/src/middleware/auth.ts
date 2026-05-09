import { createMiddleware } from 'hono/factory';
import { HTTPException } from 'hono/http-exception';
import { verify } from 'hono/jwt';
import type { Env } from '../index';

export type StaffPayload = {
	sub: string;
	role: 'owner' | 'admin' | 'mechanic';
	location_id: string;
	name: string;
};

// Shared context type used across all route files
export type AppContext = {
	Bindings: Env;
	Variables: { staff: StaffPayload };
};

export const authMiddleware = createMiddleware<AppContext>(async (c, next) => {
	const authHeader = c.req.header('Authorization');
	if (!authHeader || !authHeader.startsWith('Bearer ')) {
		throw new HTTPException(401, { message: 'Unauthorized' });
	}

	const token = authHeader.replace('Bearer ', '');

	try {
		const payload = (await verify(token, c.env.JWT_SECRET, 'HS256')) as StaffPayload;
		c.set('staff', payload);
		await next();
	} catch {
		throw new HTTPException(401, { message: 'Invalid token' });
	}
});

export const ownerOnly = createMiddleware<AppContext>(async (c, next) => {
	const staff = c.get('staff');
	if (staff.role !== 'owner' && staff.role !== 'admin') {
		throw new HTTPException(403, { message: 'Forbidden' });
	}
	await next();
});

// Aliases
export const requireAuth = authMiddleware;

export const requireOwner = createMiddleware<AppContext>(async (c, next) => {
	await new Promise<void>((resolve, reject) => {
		authMiddleware(c, async () => {
			resolve();
		}).catch(reject);
	});
	const staff = c.get('staff');
	if (staff.role !== 'owner' && staff.role !== 'admin') {
		throw new HTTPException(403, { message: 'Forbidden' });
	}
	await next();
});
