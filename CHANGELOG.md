# Changelog

All notable changes to this project will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.0.0/),
and this project adheres to
[Semantic Versioning](https://semver.org/spec/v2.0.0.html).

## [Unreleased]

## 1.0.2 - 2024-01-15

### Changed

- Add filter to fetch groups requests to exclude non 'Teams'
  resourceProvisioningOptions.

## 1.0.1 - 2023-04-17

### Changed

- Updated the log event names to use SDK provided (warn_missing_permission)

## 1.0.0 - 2022-06-29

### Added

Initial Microsoft Teams Integration.

- Ingest new entity `microsoft_teams_account`
- Ingest new entity `microsoft_teams_channel`
- Ingest new entity `microsoft_teams_team`
- Ingest new entity `microsoft_teams_user`

- Build new relationship `microsoft_teams_account_has_team`
- Build new relationship `microsoft_teams_account_has_user`
- Build new relationship `microsoft_teams_team_has_channel`
- Build new relationship `microsoft_teams_team_has_user`
