create table Events (
	guid varchar(24) not null,
	platform int not null,
	author bit not null,
	rewards varchar(255) not null,
	location varchar(255) not null,
	expirDate timestamp,
	description varchar(255),
	primary key(guid)
);

create table InvasionStatus (
	guid varchar(24) not null,
	status1 int not null,
	status2 int not null,
	primary key(guid),
	foreign key(guid) references events(guid) on delete cascade
);
	
create table Channels (
	channel_id varchar(80) not null,
	platforms int not null,
	primary key(channel_id)
);

create table Messages (
	guid varchar(24) not null,
	messages text,
	primary key(guid),
	foreign key(guid) references events(guid) on delete cascade
);
