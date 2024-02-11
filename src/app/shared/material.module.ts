import { NgModule } from "@angular/core";
import { ButtonModule} from 'primeng/button';

const MODULES_PRIME = [
  ButtonModule,
];

@NgModule({
  imports: [...MODULES_PRIME],
  exports: [...MODULES_PRIME],
})
export class MaterialModule {}
