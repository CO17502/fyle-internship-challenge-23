import { TestBed, ComponentFixture } from '@angular/core/testing';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { FormsModule } from '@angular/forms';
import { UserProfileComponent } from './user-profile.component';
import { ApiService } from '../services/api.service';
import { DebugElement } from '@angular/core';
import { By } from '@angular/platform-browser';

describe('UserProfileComponent', () => {
  let component: UserProfileComponent;
  let fixture: ComponentFixture<UserProfileComponent>;
  let debugElement: DebugElement;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [UserProfileComponent],
      imports: [HttpClientTestingModule, FormsModule],
      providers: [ApiService],
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(UserProfileComponent);
    component = fixture.componentInstance;
    debugElement = fixture.debugElement;
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should display loader skeleton when loading is true', () => {
    component.loading = true;
    fixture.detectChanges();
    const loaderSkeleton = debugElement.query(By.css('.animate-pulse'));
    expect(loaderSkeleton).toBeTruthy();
  });

  it('should not display loader skeleton when loading is false', () => {
    component.loading = false;
    fixture.detectChanges();
    const loaderSkeleton = debugElement.query(By.css('.animate-pulse'));
    expect(loaderSkeleton).toBeFalsy();
  });

  it('should display content when userData is not null', () => {
    component.userData = {
      name: 'John Papa',
      bio: 'Winter is Coming',
      location: 'Orlando, FL',
      twitter_username: 'john_papa',
      avatar_url: 'https://avatars.githubusercontent.com/u/1202528?v=4',
      html_url: 'https://github.com/johnpapa',
    };
    fixture.detectChanges();
    const userProfileInfo = debugElement.query(By.css('.user-profile-info'));
    expect(userProfileInfo).toBeTruthy();
  });

  it('should not display content when userData is null', () => {
    component.userData = null;
    fixture.detectChanges();
    const userProfileInfo = debugElement.query(By.css('.user-profile-info'));
    expect(userProfileInfo).toBeFalsy();
  });

  it('should render pagination dropdown with correct options', () => {
    component.userData = {
      name: 'John Papa',
      bio: 'Winter is Coming',
      location: 'Orlando, FL',
      twitter_username: 'john_papa',
      avatar_url: 'https://avatars.githubusercontent.com/u/1202528?v=4',
      html_url: 'https://github.com/johnpapa',
    };
    fixture.detectChanges();
    const paginationDropdown = debugElement.query(By.css('#pageSize'));
    expect(paginationDropdown).toBeTruthy();

    const expectedPageSizeOptions = [5, 10, 25, 50, 100];
    const options = paginationDropdown.nativeElement.querySelectorAll('option');
    expect(options.length).toEqual(expectedPageSizeOptions.length);
    options.forEach((option: { value: string }, index: number) => {
      expect(parseInt(option.value)).toEqual(expectedPageSizeOptions[index]);
    });
  });

  it('should not render pagination dropdown when userData is null', () => {
    component.userData = null;
    fixture.detectChanges();
    const paginationDropdown = debugElement.query(By.css('#pageSize'));
    expect(paginationDropdown).toBeFalsy();
  });

  it('should handle prevPage method correctly', () => {
    component.currentPage = 3;
    component.prevPage();
    expect(component.currentPage).toEqual(2);
  });

  it('should handle nextPage method correctly', () => {
    component.currentPage = 3;
    component.nextPage();
    expect(component.currentPage).toEqual(4);
  });
});
