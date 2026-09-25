import { Component } from '@angular/core';
import { TestBed } from '@angular/core/testing';
import { AnimateDirective } from './animate-directive';

@Component({
  imports: [AnimateDirective],
  template: `<div animate>host</div>`,
})
class Host {}

describe('AnimateDirective', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({ imports: [Host] });
  });

  it('should create an instance', () => {
    const fixture = TestBed.createComponent(Host);
    fixture.detectChanges();
    const directive = fixture.debugElement.children[0].injector.get(AnimateDirective);
    expect(directive).toBeTruthy();
    expect(directive).toBeInstanceOf(AnimateDirective);
  });
});
