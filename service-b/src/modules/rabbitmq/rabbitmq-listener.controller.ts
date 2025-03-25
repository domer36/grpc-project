import { Controller } from '@nestjs/common';
import { EventPattern, MessagePattern, Payload } from '@nestjs/microservices';
import { NotificationService } from '../notifications/notification.service';

@Controller()
export class RabbitListenerController {
  constructor(private readonly notificationService: NotificationService) {}

  @EventPattern('user_updated')
  handleUserUpdated(@Payload() data: any) {
    console.log(data);
    
    this.notificationService.send(data.id, "Usuario actualizado")
  }
}
