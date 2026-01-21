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
import { catchError, map, Observable, of } from 'rxjs';
import { Line, Run, Trip } from '@repo/types';

@Injectable({
  providedIn: 'root',
})
export class ApiService {
  private readonly _firestore = inject(Firestore);

  getLines(): Observable<Line[]> {
    const collectionRef = collection(this._firestore, 'lines');
    const constaintRef: QueryConstraint[] = [
      where('status', '==', 'active'),
      //orderBy('code', 'asc'),
    ];
    const queryRef = query(collectionRef, ...constaintRef);
    return collectionData(queryRef) as Observable<Line[]>;
    /*return collectionData(queryRef).pipe(
      catchError(() => of([])),
      map((items) => items as Line[]),
    );*/
  }

  getRuns(): Observable<Run[]> {
    const collectionRef = collection(this._firestore, 'runs');

    //const constaints: QueryConstraint[] = [
    //  where('date', '>', date),
    //  where('date', '==', '2026-01-16'),
    //orderBy('scheduledDepartureTime asc')
    //];
    //const queryRef = query(collectionRef, ...constaints)
    const queryRef = query(collectionRef, orderBy('departureTime', 'asc'));
    return collectionData(queryRef) as Observable<Run[]>;
    //return collectionData(q) as Observable<any[]>;

    // 'idField' popola automaticamente la proprietà 'id' con l'ID del documento Firestore
    //return collectionData(productsCollection, { idField: 'id' }) as Observable<Product[]>;
  }

  getTrips({ date }: { date?: string }): Observable<Trip[]> {
    const collectionRef = collection(this._firestore, 'trips');

    const constaints: QueryConstraint[] = [
      where('date', '==', date),
      orderBy('departureTime', 'asc'),
    ];
    const queryRef = query(collectionRef, ...constaints);
    //const queryRef = query(collectionRef, where('date', '==', date));
    return collectionData(queryRef, { idField: 'id' }) as Observable<Trip[]>;
  }
}
