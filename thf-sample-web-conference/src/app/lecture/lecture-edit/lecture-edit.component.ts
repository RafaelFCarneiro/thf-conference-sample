import { Component, Input, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';

import { ThfNotificationService } from '@totvs/thf-ui/services/thf-notification/thf-notification.service';
import { ThfSelectOption } from '@totvs/thf-ui/components/thf-field';

import { Lecture } from './../../model/lecture';
import { LectureService } from '../lecture.service';
import { Speaker } from './../../model/speaker';
import { SpeakerService } from '../../speaker/speaker.service';
import { Track } from '../../model/track';
import { TrackService } from './../../track/track.service';

@Component({
  selector: 'app-lecture-edit',
  templateUrl: './lecture-edit.component.html',
  styleUrls: ['./lecture-edit.component.css']
})
export class LectureEditComponent implements OnInit {

  isUpdate: boolean = false;
  speakerOptions: Array<ThfSelectOption> = [];
  speakers: Array<Speaker> = [];
  title: string = 'Create lecture';
  trackOptions: Array<ThfSelectOption> = [];
  tracks: Array<Track> = [];

  /** Objeto do tipo Lecture referente a palestra. */
  @Input('lecture') lecture: Lecture = new Lecture();

  constructor(
    private route: ActivatedRoute,
    private lectureService: LectureService,
    private router: Router,
    private speakerService: SpeakerService,
    private thfNotification: ThfNotificationService,
    private trackService: TrackService) { }

  ngOnInit() {
    this.route.params.subscribe(params => {
      if (params['id']) {
        this.getLectureById(params['id'].toString());
      }
    });

    this.trackService.get().subscribe(trackResponse => {
      if (this.isUpdate) {
        this.lecture.trackId = this.lecture.track.id;
      }

      trackResponse.items.forEach(track => {
        if (track.deleted === false) {
          this.trackOptions.push({ value: track.id, label: track.name });
          this.tracks.push(track);
        }
      });
    });

    this.speakerService.get().subscribe(speakerResponse => {
      if (this.isUpdate) {
        this.lecture.speakerId = this.lecture.speaker.id;
      }

      speakerResponse.items.forEach(speaker => {
        if (speaker.deleted === false) {
          this.speakerOptions.push({ value: speaker.id, label: speaker.name });
          this.speakers.push(speaker);
        }
      });
    });
  }

  cancel() {
    this.navigateToPath('lectures');
  }

  create() {
    this.lectureService.post(this.lecture).subscribe(lecture => {
      this.thfNotification.success(`Lecture ${lecture.title} created successfully!`);
      this.navigateToPath('lectures');
    }, error => {
      this.thfNotification.error(error.status + ' ' + error.statusText);
    });
  }

  edit() {
    this.lectureService.put(this.lecture).subscribe(lecture => {
      this.thfNotification.success(`Lecture ${lecture.title} updated successfully!`);
      this.navigateToPath('lectures');
    }, error => {
      this.thfNotification.error(error.status + ' ' + error.statusText);
    });
  }

  getLectureById(id: string) {
    this.lectureService.getById(id).subscribe(lecture => {
      this.lecture = lecture;

      this.title = `Edit lecture ${this.lecture.title}`;
      this.isUpdate = true;
    }, error => {
      this.thfNotification.error(error.status + ' ' + error.statusText);
    });
  }

  getSpeakerImage(speakerId: string) {
    return this.speakers.find(speaker => speaker.id === speakerId).photo;
  }

  getTrackColor(trackId: string) {
    return this.tracks.find(track => track.id === trackId).color;
  }

  save() {
    this.transformTimeMaskLecture();
    if (this.isUpdate) {
      this.edit();
    } else {
      this.create();
    }
  }

  private navigateToPath(path: string) {
    this.router.navigate([path]);
  }

  private transformTimeMaskLecture() {
    if (!this.lecture.startTime.includes(':')) {
      const hourStartTime = this.lecture.startTime.substring(2, 0).concat(':');
      const minuteStartTime = this.lecture.startTime.substring(4, 2).concat(':');
      const secondStartTime = this.lecture.startTime.substring(4, 6);

      this.lecture.startTime = hourStartTime.concat(minuteStartTime).concat(secondStartTime);
    }

    if (!this.lecture.endTime.includes(':')) {
      const hourEndTime = this.lecture.endTime.substring(2, 0).concat(':');
      const minuteEndTime = this.lecture.endTime.substring(4, 2).concat(':');
      const secondEndTime = this.lecture.endTime.substring(4, 6);

      this.lecture.endTime = hourEndTime.concat(minuteEndTime).concat(secondEndTime);
    }
  }

}
