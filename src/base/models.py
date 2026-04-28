from django.db import models


class Order(models.Model):
    STATUS_NEW = 'new'
    STATUS_PROCESS = 'processing'
    STATUS_COMPLETED = 'completed'
    STATUS_CANCELLED = 'cancelled'
    STATUS_CHOICES = (
        (STATUS_NEW, 'Новый'),
        (STATUS_PROCESS, 'В обработке'),
        (STATUS_COMPLETED, 'Завершен'),
        (STATUS_CANCELLED, 'Отменен'),
    )

    name = models.CharField('Имя', max_length=100)
    phone = models.CharField('Телефон', max_length=30)
    city = models.CharField('Город', max_length=100, blank=True)
    comment = models.TextField('Комментарий', blank=True)
    
    status = models.CharField('Статус', max_length=20, choices=STATUS_CHOICES, default=STATUS_NEW)
    created_at = models.DateTimeField('Дата создания', auto_now_add=True)
    updated_at = models.DateTimeField('Дата обновления', auto_now=True)

    class Meta:
        verbose_name = 'Заказ'
        verbose_name_plural = 'Заказы'
        ordering = ('-created_at',)

    def __str__(self):
        return f'Заказ #{self.id} от {self.name} ({self.created_at.strftime("%d.%m.%Y %H:%M")})'
