# Generated by Django 2.0 on 2018-07-01 09:08

from django.conf import settings
from django.db import migrations, models
import django.db.models.deletion
import snap.models


class Migration(migrations.Migration):

    initial = True

    dependencies = [
        migrations.swappable_dependency(settings.AUTH_USER_MODEL),
    ]

    operations = [
        migrations.CreateModel(
            name='Block',
            fields=[
                ('id', models.AutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('JMLid', models.IntegerField(null=True)),
                ('typeMorph', models.CharField(blank=True, max_length=30, null=True)),
                ('selector', models.CharField(blank=True, max_length=30, null=True)),
                ('blockSpec', models.CharField(blank=True, max_length=50, null=True)),
                ('category', models.CharField(blank=True, max_length=30, null=True)),
                ('parent', models.IntegerField(null=True)),
            ],
        ),
        migrations.CreateModel(
            name='BlockInput',
            fields=[
                ('id', models.AutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('JMLid', models.IntegerField(null=True)),
                ('typeMorph', models.CharField(blank=True, max_length=30, null=True)),
                ('rang', models.IntegerField(default=0)),
                ('contenu', models.CharField(blank=True, max_length=50, null=True)),
                ('isNumeric', models.BooleanField(default=True)),
                ('isPredicate', models.BooleanField(default=False)),
            ],
            options={
                'ordering': ['rang'],
            },
        ),
        migrations.CreateModel(
            name='Classe',
            fields=[
                ('id', models.AutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('nom', models.CharField(max_length=10)),
            ],
        ),
        migrations.CreateModel(
            name='Document',
            fields=[
                ('id', models.AutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('description', models.CharField(blank=True, max_length=255)),
                ('document', models.FileField(upload_to=snap.models.user_directory_path)),
                ('uploaded_at', models.DateTimeField(auto_now_add=True, verbose_name='Date de sauvegarde')),
                ('user', models.ForeignKey(null=True, on_delete=django.db.models.deletion.CASCADE, to=settings.AUTH_USER_MODEL)),
            ],
        ),
        migrations.CreateModel(
            name='Eleve',
            fields=[
                ('id', models.AutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('classe', models.ForeignKey(on_delete=django.db.models.deletion.CASCADE, to='snap.Classe')),
            ],
        ),
        migrations.CreateModel(
            name='Evenement',
            fields=[
                ('id', models.AutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('type', models.CharField(choices=[('ENV', 'Environnement'), ('EPR', 'Etat du Programme'), ('SPR', 'Structure du Programme'), ('SCR', 'Script'), ('AUT', 'Autre évènement')], default='AUT', max_length=3)),
                ('time', models.IntegerField()),
                ('numero', models.IntegerField()),
                ('creation', models.DateTimeField(auto_now_add=True)),
            ],
            options={
                'ordering': ('-creation',),
            },
        ),
        migrations.CreateModel(
            name='EvenementENV',
            fields=[
                ('id', models.AutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('type', models.CharField(choices=[('LANCE', 'Lancement (ou relancement) de Snap'), ('MENU', 'Clic Menu'), ('PARAM', 'Clic Menu paramètres'), ('NEW', 'Nouveau programme vide'), ('LOBA', 'Chargement programme de Base'), ('LOVER', "Chargement d'une version sauvegardée"), ('IMPORT', 'Importation fichier local'), ('EXPORT', 'Exportation fichier local'), ('FULL', 'Plein écran'), ('APP', 'Ecran application'), ('SSCRN', 'Ecran réduit'), ('NSCRN', 'Ecran normal'), ('SBS', 'Pas à pas'), ('GREEN', 'Clic Green Flag'), ('PAUSE', 'Clic Mise en pause'), ('REPR', 'Clic Reprise'), ('STOP', 'Clic Stop'), ('KEY', 'Evènement Clavier'), ('AFFBL', 'Affichage Blocs'), ('AFFVAR', 'Affichage ou non Variable'), ('DROPEX', 'Drop dans la palette (suppression)'), ('UNDROP', 'Undrop'), ('REDROP', 'Redrop'), ('DUPLIC', 'Duplication'), ('POPUP', 'Ouverture popup'), ('AUTRE', '(Non identifié)')], default='AUTRE', max_length=6)),
                ('click', models.BooleanField(default=False)),
                ('key', models.BooleanField(default=False)),
                ('detail', models.TextField(blank=True, null=True)),
                ('valueBool', models.NullBooleanField()),
                ('valueInt', models.IntegerField(null=True)),
                ('valueChar', models.CharField(blank=True, max_length=30, null=True)),
                ('evenement', models.ForeignKey(on_delete=django.db.models.deletion.CASCADE, related_name='environnement', to='snap.Evenement')),
            ],
            options={
                'ordering': ('-evenement__creation',),
            },
        ),
        migrations.CreateModel(
            name='EvenementEPR',
            fields=[
                ('id', models.AutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('receiver', models.CharField(max_length=30, null=True)),
                ('topBlockSelector', models.CharField(max_length=30, null=True)),
                ('topBlockId', models.PositiveIntegerField(null=True)),
                ('click', models.BooleanField(default=False)),
                ('errorFlag', models.BooleanField(default=False)),
                ('type', models.CharField(choices=[('NEW', 'Nouveau programme vide'), ('LOAD', 'Programme chargé'), ('SAVE', 'Programme sauvegardé'), ('START', 'Lancement'), ('STOP', 'Arrêt'), ('FIN', 'Terminaison'), ('PAUSE', 'Pause'), ('REPR', 'Reprise'), ('ERR', 'Erreur'), ('ASK', "Demande d'une entrée utilisateur"), ('ANSW', "Entrée de l'utilisateur"), ('SNP', 'Snapshot'), ('AUTRE', '(Non identifié)')], default='AUTRE', max_length=5)),
                ('detail', models.CharField(blank=True, max_length=100, null=True)),
                ('processes', models.CharField(blank=True, max_length=100, null=True)),
                ('evenement', models.ForeignKey(on_delete=django.db.models.deletion.CASCADE, to='snap.Evenement')),
            ],
            options={
                'ordering': ('-evenement__creation',),
            },
        ),
        migrations.CreateModel(
            name='EvenementSPR',
            fields=[
                ('id', models.AutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('type', models.CharField(choices=[('DROP', "Déplacement d'un bloc"), ('NEW', "Création d'une brique"), ('DUPLIC', 'Duplication de bloc'), ('DEL', "Suppression d'un bloc"), ('NEWVAR', 'Création nouvelle variable globale'), ('NEWVARL', 'Création nouvelle variable locale'), ('DELVAR', 'Suppression variable'), ('RENVAR', 'renommage variable'), ('RENVARL', 'renommage variable locale'), ('RENVARB', 'renommage variable de bloc'), ('RENVAT', 'renommage variable, juste le template'), ('RENVATL', 'renommage variable locale, juste le template'), ('RENVATB', 'renommage variable de bloc, juste le template'), ('VAL', "Changement d'une valeur"), ('+IN', "Ajout d'une entrée"), ('-IN', "Suppression d'une entrée"), ('NEWVAL', "Création et insertion d'une entrée"), ('DROPVAL', "Déplacement et insertion d'une entrée"), ('ERR', 'Erreur'), ('OPEN', 'Ouverture de Scripts'), ('AUTRE', '(Non identifié')], default='AUTRE', max_length=7)),
                ('detail', models.TextField(blank=True, null=True)),
                ('location', models.CharField(blank=True, max_length=30, null=True)),
                ('blockId', models.IntegerField(null=True)),
                ('typeMorph', models.CharField(blank=True, max_length=30, null=True)),
                ('selector', models.CharField(blank=True, max_length=30, null=True)),
                ('blockSpec', models.CharField(blank=True, max_length=50, null=True)),
                ('category', models.CharField(blank=True, max_length=30, null=True)),
                ('parentId', models.IntegerField(null=True)),
                ('nextBlockId', models.IntegerField(null=True)),
                ('childId', models.IntegerField(null=True)),
                ('targetId', models.IntegerField(null=True)),
                ('evenement', models.ForeignKey(on_delete=django.db.models.deletion.CASCADE, to='snap.Evenement')),
                ('inputs', models.ManyToManyField(null=True, to='snap.BlockInput')),
                ('scripts', models.ManyToManyField(to='snap.Block')),
            ],
            options={
                'ordering': ('-evenement__creation',),
            },
        ),
        migrations.CreateModel(
            name='InfoReceived',
            fields=[
                ('id', models.AutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('block_id', models.IntegerField()),
                ('time', models.IntegerField()),
                ('action', models.CharField(blank=True, max_length=30, null=True)),
                ('blockSpec', models.CharField(blank=True, max_length=100, null=True)),
                ('user', models.CharField(max_length=10)),
            ],
        ),
        migrations.CreateModel(
            name='ProgrammeBase',
            fields=[
                ('id', models.AutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('nom', models.CharField(blank=True, max_length=50, null=True)),
                ('file', models.FileField(upload_to=snap.models.user_directory_path)),
                ('creation', models.DateTimeField(auto_now_add=True)),
                ('user', models.ForeignKey(on_delete=django.db.models.deletion.CASCADE, to=settings.AUTH_USER_MODEL)),
            ],
        ),
        migrations.CreateModel(
            name='SnapSnapShot',
            fields=[
                ('id', models.AutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('image', models.ImageField(blank=True, upload_to=snap.models.userSnapShot)),
                ('evenement', models.ForeignKey(on_delete=django.db.models.deletion.CASCADE, related_name='image', to='snap.Evenement')),
            ],
        ),
        migrations.AddField(
            model_name='evenement',
            name='programme',
            field=models.ForeignKey(null=True, on_delete=django.db.models.deletion.CASCADE, to='snap.ProgrammeBase'),
        ),
        migrations.AddField(
            model_name='evenement',
            name='user',
            field=models.ForeignKey(on_delete=django.db.models.deletion.CASCADE, to=settings.AUTH_USER_MODEL),
        ),
        migrations.AddField(
            model_name='eleve',
            name='prg',
            field=models.ForeignKey(blank=True, null=True, on_delete=django.db.models.deletion.CASCADE, to='snap.ProgrammeBase', verbose_name='Programme de la séance'),
        ),
        migrations.AddField(
            model_name='eleve',
            name='user',
            field=models.OneToOneField(on_delete=django.db.models.deletion.CASCADE, to=settings.AUTH_USER_MODEL),
        ),
        migrations.AddField(
            model_name='block',
            name='inputs',
            field=models.ManyToManyField(null=True, to='snap.BlockInput'),
        ),
        migrations.AddField(
            model_name='block',
            name='inputsBlock',
            field=models.ManyToManyField(null=True, to='snap.Block'),
        ),
        migrations.AddField(
            model_name='block',
            name='nextBlock',
            field=models.OneToOneField(null=True, on_delete=django.db.models.deletion.CASCADE, related_name='prec', to='snap.Block'),
        ),
    ]
