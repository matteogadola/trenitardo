import { inject, Injectable } from '@angular/core';
import {
  collection,
  collectionData,
  Firestore,
  orderBy,
  query,
  QueryConstraint,
  where,
} from '@angular/fire/firestore';
import { map, Observable, shareReplay } from 'rxjs';
import { Line, Run, Trip } from '@repo/types';

@Injectable({
  providedIn: 'root',
})
export class ApiService {
  private readonly _firestore = inject(Firestore);
  private readonly _lines$ = this.fetchLines().pipe(shareReplay(1));
  private readonly _runs$ = this.fetchRuns().pipe(shareReplay(1));

  getLines(): Observable<Line[]> {
    return this._lines$;
  }
  getRuns(): Observable<Run[]> {
    return this._runs$;
  }

  getTrips({ range }: { range: { startDate: string; endDate?: string } }): Observable<Trip[]> {
    const collectionRef = this.inferCollection<Trip>('trips');

    let queryRef;
    if (range.endDate) {
      const constaints: QueryConstraint[] = [
        where('date', '>=', range.startDate),
        where('date', '<=', range.endDate),
      ];
      queryRef = query(collectionRef, ...constaints);
    } else {
      queryRef = query(collectionRef, where('date', '==', range.startDate));
    }

    return collectionData(queryRef, { idField: 'id' }).pipe(
      map((trips) =>
        trips
          .filter((item) => item.status !== 'scheduled')
          .sort((a, b) => a.departureTime.localeCompare(b.departureTime)),
      ),
    );
  }

  private inferCollection<T extends object>(path: string) {
    return collection(this._firestore, path).withConverter({
      toFirestore: (data: T) => data,
      fromFirestore: (snap) => ({ id: snap.id, ...snap.data() }) as T,
    });
  }

  // 3. Metodi privati che creano la query
  private fetchLines(): Observable<Line[]> {
    const collectionRef = this.inferCollection<Line>('lines');
    const queryRef = query(collectionRef, where('status', '==', 'active'));
    return collectionData(queryRef) as Observable<Line[]>;
  }

  private fetchRuns(): Observable<Run[]> {
    const collectionRef = this.inferCollection<Run>('runs');
    const queryRef = query(collectionRef, orderBy('departureTime', 'asc'));
    return collectionData(queryRef, { idField: 'id' }) as Observable<Run[]>;
  }
}
