<!-- START doctoc generated TOC please keep comment here to allow auto update -->
<!-- DON'T EDIT THIS SECTION, INSTEAD RE-RUN doctoc TO UPDATE -->

**Table of Contents** _generated with [DocToc](https://github.com/thlorenz/doctoc)_

- [Past Election Map for Thailand](#past-election-map-for-thailand)
  - [What is this about?](#what-is-this-about)
  - [Development](#development)
    - [Prerequisites](#prerequisites)
    - [Install dependencies](#install-dependencies)
    - [Run development mode](#run-development-mode)
    - [Build the project into a static web page](#build-the-project-into-a-static-web-page)
    - [Resources for Developers](#resources-for-developers)
    - [Environments](#environments)
  - [System Design](#system-design)
    - [Election zone](#election-zone)
  - [Help Wanted](#help-wanted)
    - [Contribute](#contribute)
    - [Join Slack](#join-slack)

<!-- END doctoc generated TOC please keep comment here to allow auto update -->

# Past Election Map for Thailand

### What is this about?

**ELECT**'s mission is to make politics more accessible for Thai people. With **Past Election Map**, we want to show information in the geo-political area. The goals are to display:

- How vote zone visually changes, e.g. any [gerrymandering](https://en.wikipedia.org/wiki/Gerrymandering) ongoing?
- How power wrangling between parties evolves, both provincially and regionally.
- How well candidates run campaigns over several elections.

## Development

### Prerequisites

You need to install these tools first in order to develop this project:

- Node.js (10.x)

### Install dependencies

```
npm i
```

### Run development mode

```
npm start
```

### Build the project into a static web page

```
npm run build
```

### Resources for Developers

- Design reference: [Invision](https://projects.invisionapp.com/share/2VW3KECQMPZ)

### Environments

| Environment                                       | Description                                  |
| ------------------------------------------------- | -------------------------------------------- |
| Dev                                               | Each PR will be built and hosted on Netlify. |
| [Staging](https://past-election-map.netlify.com/) | Latest features awaiting for release.        |
| Production                                        | Public website. No launch date yet.          |

## System Design

### Election zone

Election zone data is stored in `src/data/thailand-election.topojson` with multiple object layers for each election year e.g. B.E. 2562, 2557, 2554 and 2550. This is a concise data:

```js
{
  type: "Topology",
  arcs: [
    /* ... */
  ],
  objects: {
    "eleciton-2562": {
      /* ... */
    },
    "eleciton-2557": {
      /* ... */
    },
    "eleciton-2554": {
      /* ... */
    },
    "eleciton-2550": {
      type: "GeometryCollection",
      geometries: [
        {
          arcs: [[4567, -3932, -3905, -3920, -4038]],
          type: 'Polygon',
          properties: {
            id: '90-6',
            province_id: '90',
            province_name: 'สงขลา',
            province_name_en: 'Songkhla',
            zone_id: 6,
            zone_name: 'สงขลา เขต 6'
            code_name: 'สข',
            code_name_en: 'SKA',
            region_id: '4',
            region_name: 'ใต้',
            detail:
              'อ.คลองหอยโข่ง, อ.สะเดา ...',
          }
        },
        /* more election zones */
      ]
    }
  }
}
```

## Help Wanted

### Contribute

Every helping hand is appreciated. You can start by checking [pending issues](https://github.com/codeforthailand/past-election-map/issues), post a comment saying you want to help the issue, code with fun, then send a PR. We believe all merges contribute to a democratic movement for Thialand.

### Join Slack

To get more involved with ELECT team, create an issue titled **"Join team on Slack"** with your email. Then wait for an invitation.
