import { screenshotTesting, getComponentScreenshotTestCases } from '../../utils';

const clip = { x: 0, y: 0, width: 540, height: 50 };

describe(
    'FileUploadItem | name with statuses',
    screenshotTesting({
        cases: getComponentScreenshotTestCases({
            componentName: 'file-upload-item',
            knobs: {
                name: ['photo.jpg'],
                uploadStatus: ['ERROR', 'SUCCESS', 'LOADING', 'UPLOADING'],
                showDelete: [true],
            },
        }),
        it,
        beforeAll,
        afterAll,
        expect,
        matchImageSnapshotOptions: {
            failureThresholdType: 'pixel',
            failureThreshold: 5,
        },
        screenshotOpts: { clip },
    }),
);

describe(
    'FileUploadItem | meta',
    screenshotTesting({
        cases: getComponentScreenshotTestCases({
            componentName: 'file-upload-item',
            knobs: {
                name: ['photo.jpg'],
                uploadDate: ['22.01.2018'],
                size: [45000],
                downloadLink: ['/link'],
                uploadStatus: ['SUCCESS'],
                showDelete: [true],
            },
        }),
        it,
        beforeAll,
        afterAll,
        expect,
        screenshotOpts: { clip },
    }),
);

describe(
    'FileUploadItem | hide meta when uploadStatus !== SUCCESS',
    screenshotTesting({
        cases: getComponentScreenshotTestCases({
            componentName: 'file-upload-item',
            knobs: {
                name: ['photo.jpg'],
                uploadDate: ['22.01.2018'],
                size: [45000],
                showDelete: [true],
                uploadStatus: ['ERROR', 'LOADING', 'UPLOADING'],
            },
        }),
        it,
        beforeAll,
        afterAll,
        expect,
        screenshotOpts: { clip },
    }),
);

describe(
    'FileUploadItem | hide meta when showRestore === true',
    screenshotTesting({
        cases: getComponentScreenshotTestCases({
            componentName: 'file-upload-item',
            knobs: {
                name: ['photo.jpg'],
                uploadDate: ['22.01.2018'],
                size: [45000],
                showRestore: [true],
            },
        }),
        it,
        beforeAll,
        afterAll,
        expect,
        screenshotOpts: { clip },
    }),
);
