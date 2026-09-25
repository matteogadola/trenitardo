import { TestBed } from '@angular/core/testing';

import { firestoreDoubles } from '../../../../test-doubles';
import { Firestore } from '@angular/fire/firestore';
import { ApiService, type RunDraft } from './api-service';

describe('ApiService', () => {
  let service: ApiService;

  const draft: RunDraft = {
    code: '2812',
    codeName: '2812',
    departureTime: '08:00',
    arrivalTime: '09:00',
    origin: 'Roma',
    originId: 'S01700',
    destination: 'Milano',
    destinationId: 'S01701',
    direction: 1,
    line: { id: 'line-1', code: 'RE', type: 'Regionale', name: 'Linea 1' },
    serviceDays: [2, 3, 4, 5, 6],
    servicePeriod: { startDate: '2026-01-01', endDate: '2026-12-31' },
    serviceExceptions: { excludedDates: [], includedDates: [] },
  };

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [{ provide: Firestore, useValue: {} }],
    });
    service = TestBed.inject(ApiService);

    firestoreDoubles.addDoc.mockClear();
    firestoreDoubles.updateDoc.mockClear();
    firestoreDoubles.deleteDoc.mockClear();
    firestoreDoubles.doc.mockClear();
    firestoreDoubles.addDoc.mockResolvedValue({ id: 'new-run' });
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  it("createRun aggiunge un documento e ritorna l'id", async () => {
    firestoreDoubles.addDoc.mockResolvedValue({ id: 'run-42' });

    await expect(service.createRun(draft)).resolves.toBe('run-42');
    expect(firestoreDoubles.addDoc).toHaveBeenCalledOnce();
  });

  it('updateRun aggiorna il documento', async () => {
    await service.updateRun('run-42', draft);

    expect(firestoreDoubles.doc).toHaveBeenCalledWith(expect.anything(), 'runs', 'run-42');
    expect(firestoreDoubles.updateDoc).toHaveBeenCalledOnce();
  });

  it('deleteRun elimina il documento', async () => {
    await service.deleteRun('run-42');

    expect(firestoreDoubles.doc).toHaveBeenCalledWith(expect.anything(), 'runs', 'run-42');
    expect(firestoreDoubles.deleteDoc).toHaveBeenCalledOnce();
  });
});
