import {
  Directive,
  ElementRef,
  Renderer2,
  OnInit,
  HostListener,
  HostBinding,
  Input
} from '@angular/core';

@Directive({
  selector: '[pbsHighlightOnHover]'
})
export class HighlightOnHoverDirective implements OnInit {

  @Input() defaultColor: string;
  @Input() highlight = 'white';
  @HostBinding('style.color') color: string = this.defaultColor;

  constructor(
    private elementRef: ElementRef,
    private renderer: Renderer2) { }

  ngOnInit() {
    this.color = this.defaultColor;
  }

  @HostListener('mouseenter') mouseover() {
    this.renderer.setStyle(this.elementRef.nativeElement, 'background-color', 'blue');

    this.color = this.highlight;
  }

  @HostListener('mouseleave') mouseleave() {
    this.renderer.setStyle(this.elementRef.nativeElement, 'background-color', 'transparent');
    this.color = this.defaultColor;
  }

}
