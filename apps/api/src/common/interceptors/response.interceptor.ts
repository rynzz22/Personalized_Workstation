import {
  CallHandler,
  ExecutionContext,
  Injectable,
  NestInterceptor,
} from '@nestjs/common';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';

export interface ResponseEnvelope<T> {
  data: T;
  meta?: Record<string, any>;
}

@Injectable()
export class ResponseInterceptor<T> implements NestInterceptor<T, ResponseEnvelope<T>> {
  intercept(context: ExecutionContext, next: CallHandler): Observable<ResponseEnvelope<T>> {
    return next.handle().pipe(
      map((result) => {
        // If already formatted with data property, return as is
        if (result && typeof result === 'object' && 'data' in result) {
          return result;
        }

        // Check if result has pagination items and meta
        if (result && typeof result === 'object' && 'items' in result && 'meta' in result) {
          return {
            data: result.items,
            meta: result.meta,
          };
        }

        return {
          data: result ?? {},
        };
      })
    );
  }
}
