BACKEND :

1 Création de l’environnement virtuel: py –m venv venv
2 Utilisation/Activation du venv: source path/venv/Scripts/activate
3 Installation des librairies depuis un fichier: pip install -r requirements.txt
4 Créer une base de données PostgreSQL
    bdd: garagelocation
    username: postgres
    mdp: toor
5 - Faire un python manage.py migrate et un python manage.py createsuperuser

Le backend est complet et fonctionne


FRONTEND :

1 - npm i

J'ai fais le backend ce matin en 1h et j'ai passé toute la journée à bloquer sur l'implémentation de JWT token avec redux toolkit query dans mon store React.
J'ai choisi de me challenger avec ces technologies car je savais déjà faire à peu près tout le tp étant donné que c'est exactement les technologies que j'utilise en entreprise.
L'intéret d'essayer d'implémenter RTK été aussi d'avoir un store global à react et de pouvoir enregistrer les requêtes en cache.
C'était une erreur car je suis rester tout la journée bloquer sur ça résultat mon backend fonctionnne, mon frontend est à peu près fait mais je n'ai pas réussi à lier l'authentification au frontend.

Lien api : http://localhost:8000/v1/


TECHNOS :

Backend :
    postgreSQL
    Django
    DRF
    simple-JWT

Frontend :
    React
    redux toolkit & redux toolkit query
    Material UI
    Tailwind CSS


COMPETENCES :

• Élaborer une IHM mobile en fonction des exigences (adapté aux mobiles/tablettes ?) : ACQUIS
• Construire un schéma de données de l’application (Modèles bien construits ?) : ACQUIS
• Développer une application ainsi que son API (App et communication back/front ?) : PARTIELLEMENT ACQUIS
• Élaborer les jeux d’essai (Mise en place des TU ?) : PARTIELLEMENT ACQUIS
• Mettre en œuvre la documentation technique (README clair ? installation ? …) : ACQUIS
• Modéliser l’expression des besoins (user stories ? use cases ? ...) : PARTIELLEMENT ACQUIS