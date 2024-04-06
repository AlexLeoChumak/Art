import { Injectable } from '@angular/core';
import { Post } from '../models/post';

@Injectable({
  providedIn: 'root',
})
export class MocDataService {
  readonly posts: Post[] = [
    {
      title: 'Lorem ipsum',
      permalink: 'Lorem-ipsum',
      excerpt:
        'Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. ',
      category: {
        category: 'Winter',
        categoryId: '111',
      },
      postImgUrl:
        '../../assets/moc-image/674553b8c4bf4a0cb9a3085996cf0c49.jpeg',
      content:
        'Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.',
      isFeatured: true,
      views: 23,
      status: 'status',
      createdAt: new Date(),
      id: '11',
    },
    {
      title: 'Lorem ipsum',
      permalink: 'Lorem-ipsum',
      excerpt:
        'Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. ',
      category: {
        category: 'Beach',
        categoryId: '222',
      },
      postImgUrl:
        '../../assets/moc-image/1675479286_gas-kvas-com-p-fonovii-risunok-rabochego-stola-plyazh-40.jpg',
      content:
        'Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.',
      isFeatured: true,
      views: 23,
      status: 'status',
      createdAt: new Date(),
      id: '22',
    },
    {
      title: 'Lorem ipsum',
      permalink: 'Lorem-ipsum',
      excerpt:
        'Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. ',
      category: {
        category: 'Beach',
        categoryId: '222',
      },
      postImgUrl:
        '../../assets/moc-image/674553b8c4bf4a0cb9a3085996cf0c49.jpeg',
      content:
        'Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.',
      isFeatured: true,
      views: 23,
      status: 'status',
      createdAt: new Date(),
      id: '33',
    },
    {
      title: 'Lorem ipsum',
      permalink: 'Lorem-ipsum',
      excerpt:
        'Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. ',
      category: {
        category: 'Mountains',
        categoryId: '333',
      },
      postImgUrl: '../../assets/moc-image/foto.jpg',
      content:
        'Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.',
      isFeatured: true,
      views: 23,
      status: 'status',
      createdAt: new Date(),
      id: '44',
    },
  ];

  readonly categories = [
    {
      category: 'Mountains',
      categoryId: '333',
    },
    {
      category: 'Beach',
      categoryId: '222',
    },
    {
      category: 'Winter',
      categoryId: '111',
    },
  ];

  constructor() {}
}
