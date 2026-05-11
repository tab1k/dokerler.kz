from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('products', '0002_category_image'),
    ]

    operations = [
        migrations.AddField(
            model_name='category',
            name='model_3d',
            field=models.FileField(blank=True, upload_to='category_models/', verbose_name='3D модель категории (.glb/.gltf)'),
        ),
    ]
