import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { Transcript } from '../../models/transcript';
import { VideoMetadata } from '../../models/report';
import { SystemError } from '../../models/global';

interface ReportState {
  video?: string;
  transcript?: Transcript;
  overview?: string;
  keyPoints?: string[];
  actionItems?: string[];
}

// on the same day Moscow said Ukraine struck deep into Russia with us-made attack's missiles President Vladimir Putin lowered Russia's threshold for a nuclear response to be able to respond to a broader range of conventional attacks Russia has the world's biggest nuclear Arsenal and Putin is the main decision maker on how to use it the change was published on the 10,000th day of the war in Ukraine and Drew Swift rebuke from its President Vladimir zalinski especially these day they presented nuclear weapon strategy why they didn't present peace strategy did you hear it did you did you read about it no of course of course nuclear weapon strategy Putin wants War speaking in Brazil Russian foreign minister Sergey lavro warned against cherry-picking what's in the new doctrine saying I hope this Doctrine will be read the old one said Russia could fight nuclear with nuclear or use nuclear weapons against a conventional attack that threatened its very existence analysts say the big change now is that Russia could consider a nuclear strike in response to a conventional attack that posed what it called a critical threat to its sovereignty or territory together Russia and the US control 88% of the world's nuclear warheads the US National Security Council said it had not seen any reason to adjust its nuclear posture Moscow has been warning the West for months that if Washington gave the green light to Ukraine to fire us British and French missiles deep into Russia it would consider those NATO members to be directly involved in the war British prime minister Kier starmer spoke to reporters from the G20 in Brazil there's irresponsible rhetoric um coming from Russia um and that is not going to deter our support for Ukraine moscow's forces are advancing at their fastest Pace since the early weeks of the conflict with some Russian and Western officials alike saying the war could be entering its final and most dangerous phase

const initialState: ReportState = {};

const ReportSlice = createSlice({
  name: 'report',
  initialState,
  reducers: {
    // transcript
    loadTranscript(state, action: PayloadAction<VideoMetadata>) {},
    loadTranscriptFail(state, action: PayloadAction<SystemError>) {},
    updateTranscript(state, action: PayloadAction<Transcript>) {
      state.transcript = action.payload;
    },

    // overview
    loadOverview(state, action: PayloadAction<Transcript>) {},
    loadOverviewFail(state, action: PayloadAction<SystemError>) {},
    updateOverview(state, action: PayloadAction<string>) {
      state.overview = action.payload;
    },

    // keypoints
    loadKeyPoints(state, action: PayloadAction<Transcript>) {},
    loadKeyPointsFail(state, action: PayloadAction<SystemError>) {},
    updateKeyPoints(state, action: PayloadAction<string[]>) {
      state.keyPoints = action.payload;
    },

    // action items
    loadActionItems(state, action: PayloadAction<Transcript>) {},
    loadActionItemsFail(state, action: PayloadAction<SystemError>) {},
    updateActionItems(state, action: PayloadAction<string[]>) {
      state.actionItems = action.payload;
    },

    // TODO: related topics
  },
});

export const reportActions = ReportSlice.actions;

export default ReportSlice.reducer;
