import { Component, Input } from '@angular/core';
import { Product } from '../../shared/interfaces/product.interface';
import { CardModule } from 'primeng/card';

const IMPORTS_MODULES = [
  CardModule,
];

@Component({
  selector: 'app-product',
  standalone: true,
  imports: [...IMPORTS_MODULES],
  templateUrl: './product.component.html',
  styleUrl: './product.component.scss'
})
export class ProductComponent {
  @Input({ required: true }) product?: Product;
}
