# Réussite

Le solitaire classique (Klondike) : range les 52 cartes dans les quatre familles, de l'As au Roi, en déplaçant les cartes entre sept colonnes. Pioche une ou trois cartes à la fois, annule sans limite, et bats ton meilleur temps.

*English version: [README.en.md](README.en.md)*

## La mise en place

- Sept **colonnes** de 1 à 7 cartes ; seule la dernière de chacune est retournée.
- Le **talon** (en haut à gauche) contient le reste des cartes.
- Quatre **familles** (en haut à droite), vides au départ.

## Les règles

- **Colonnes** : une carte se pose sur une carte d'une valeur juste au-dessus et de l'autre couleur (un 7 rouge sur un 8 noir). On peut déplacer d'un coup une suite de cartes bien rangées. Une colonne vide n'accepte qu'un **Roi**.
- Quand on déplace la dernière carte visible d'une colonne, celle du dessous se retourne.
- **Familles** : de l'As au Roi, dans la même couleur (cœur, carreau, trèfle, pique).
- **Talon** : un clic retourne une carte, ou trois avec l'option **Piocher 3 cartes à la fois** (seule celle du dessus est jouable). Quand le talon est vide, un clic remet les cartes retournées.
- La partie est gagnée quand les quatre familles sont complètes. Dès que toutes les cartes sont découvertes, le jeu termine tout seul.

## Commandes

- **Glisser** une carte (ou une suite) vers sa destination.
- **Clic** sur une carte : elle part toute seule à la meilleure place possible (une famille d'abord, sinon une colonne).
- **Annuler** : reprend le dernier coup, autant de fois que tu veux.
- **Nouvelle partie** : une nouvelle donne. Après une victoire, un clic en lance une.

Le temps et le nombre de coups s'affichent en bas de l'écran.

## Statistiques

Parties réussies sur parties jouées, et meilleur temps.

## Données et synchronisation

Tes réussites, ton meilleur temps et le choix de pioche sont enregistrés par NeoDex, sauvegardés et synchronisés entre tes PC si la synchro est activée.

## Installer

Dans NeoDex : **NeoStore → À découvrir → Réussite → Installer**.

Développer un plugin : voir le [SDK NeoDex](https://github.com/NDesumeur/neodex-sdk).
